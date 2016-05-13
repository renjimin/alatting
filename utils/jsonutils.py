import json as _jsonlib
__author__ = 'charlie'


def css2json(css):
    "css转成json"

    def trim(s): return s.strip()

    # Remove all comments from the css-file
    while True:
        comment_open = css.find('/*')
        comment_close = css.find('*/')
        if (comment_open == -1) or (comment_close == -1):
            break
        css = css[:comment_open] + css[comment_close+2:]

    # Helper method that transform an array to a object, by splitting each
    # declaration (_font: Arial_) into key (_font_) and value(_Arial_).
    def toObject(array):
        ret = {}
        for elm in array:
            property, value = map(trim, elm.split(':', 1))
            ret[property] = value
        return ret

    json = {}

    # Each rule gets parsed and then removed from _css_ until all rules have been
    # parsed.
    while len(css) > 0:
        # Save the index of the first left bracket and first right bracket.
        lbracket = css.find('{')
        rbracket = css.find('}')

        # Part 1: The declarations
        #
        # Transform the declarations to an object. For example, the declarations<br/>
        #  `font: 'Times New Roman' 1em; color: #ff0000; margin-top: 1em;`<br/>
        # result in the object<br/>
        # `{"font": "'Times New Roman' 1em", "color": "#ff0000", "margin-top": "1em"}`.

        # Split the declaration block of the first rule into an array and remove
        # whitespace from each declaration.
        declarations = filter(None, map(trim, css[lbracket+1:rbracket].split(';')))

        # _declaration_ is now an array reado to be transformed into an object.
        declarations = toObject(declarations)

        # Part 2: The selectors
        #
        # Each selector in the selectors block will be associated with the
        # declarations defined above. For example, `h1, p#bar {color: red}`<br/>
        # result in the object<br/>
        # {"h1": {color: red}, "p#bar": {color: red}}

        # Split the selectors block of the first rule into an array and remove
        # whitespace, e.g. `"h1, p#bar, span.foo"` get parsed to
        # `["h1", "p#bar", "span.foo"]`.
        selectors = map(trim, css[:lbracket].split(','))

        # Iterate through each selector from _selectors_.
        for selector in selectors:
            # Initialize the json-object representing the declaration block of
            # _selector_.
            if selector not in json:
                json[selector] = {}

            # Save the declarations to the right selector
            for key in declarations:
                json[selector][key] = declarations[key]

        css = css[rbracket+1:].strip()

    return _jsonlib.dumps(json)


def json2css(json):
    """json转回css, 这个转有点弱，要求css文件书写规范"""
    root = _jsonlib.loads(json)
    for selectors in root.items():
        for k, v in selectors[1].items():
            selectors[1][k] = v + ";"
    handler_json = _jsonlib.dumps(root)
    return str(handler_json).replace("\"", "").replace(",", "")


def merge_json(old_json, new_json):
    """合并两个json，返回json,以new_json字段为准"""
    old_dict = _jsonlib.loads(old_json)
    new_dict = _jsonlib.loads(new_json)

    for key, value in old_dict.items():
        if key in new_dict.keys():
            old_dict[key].update(new_dict[key])
    for key, value in new_dict.items():
        if key not in old_dict.keys():
            old_dict[key] = value
    return _jsonlib.dumps(old_dict)
