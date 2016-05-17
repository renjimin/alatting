import json as _jsonlib
__author__ = 'charlie'


def css2json(css):
    "css转成json"

    def trim(s): return s.strip()

    # 删除所有的注释文字
    while True:
        comment_open = css.find('/*')
        comment_close = css.find('*/')
        if (comment_open == -1) or (comment_close == -1):
            break
        css = css[:comment_open] + css[comment_close+2:]

    def toObject(array):
        ret = {}
        for elm in array:
            property, value = map(trim, elm.split(':', 1))
            ret[property] = value
        return ret

    json = {}

    while len(css) > 0:
        lbracket = css.find('{')
        rbracket = css.find('}')
        declarations = filter(None, map(trim, css[lbracket+1:rbracket].split(';')))
        declarations = toObject(declarations)
        selectors = map(trim, css[:lbracket].split(','))

        for selector in selectors:
            if selector not in json:
                json[selector] = {}

            for key in declarations:
                json[selector][key] = declarations[key]

        css = css[rbracket+1:].strip()

    return _jsonlib.dumps(json)


def json2css(json):
    """json转回css, 这个转有点弱，要求css文件书写规范"""
    css = ""
    root = _jsonlib.loads(json)
    for selectors in root.items():
        css = css + selectors[0] + '{'
        for k, v in selectors[1].items():
            css = css + '{}:{};'.format(k, v)
        css = css + '}\n'
    return css

def merge_json(old_json, new_json):
    """合并两个json，返回json,以new_json字段为准"""
    old_dict = _jsonlib.loads(old_json)
    new_dict = _jsonlib.loads(new_json)

    for key, value in old_dict.items():
        if key in new_dict.keys():
            if old_dict[key] != new_dict[key]:  # 如果两个不同，则用最新的
                old_dict[key].update(new_dict[key])
    for key, value in new_dict.items():
        if key not in old_dict.keys():
            old_dict[key] = value
    return _jsonlib.dumps(old_dict)
