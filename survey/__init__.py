import re

class AnswerException(Exception):
	"""Thrown from an answer processor to generate an error message"""
	pass

def regex_check(pattern, answer):
	return re.match(pattern, answer)

	
#define different types of questions
QuestionChoices = [
	('choice', 'A list of choices to choose from'),
	('choice-input', 'A list of choices with input text to choose from'),
	('checkbox', 'A list of checkboxes to choose from'),
	('text', 'simple text input'),
	('textarea', 'textarea input')
]
#choice
def question_choice(request, question):
	choices = []
	for choice in question.choices():
		choices.append(choice)
	return {
		'choices': choices,
	}
def process_choice(question, answer):
	opt = ""
	if answer and 'ANSWER' in answer:
		opt = answer['ANSWER']
	if question.required and not opt:
		raise AnswerException('必须选择一个选项')
	if question.regex:
		if regex_check(question.regex, opt):
			pass
		else:
			raise AnswerException(question.errmsg)
	return opt
#choice-input
def question_choice_input(request, question):
	choices = []
	for choice in question.choices():
		choices.append(choice) 
		choice.inps = []	 
		for inp in choice.inputs():
			choice.inps.append(inp)
	return {
		'choices': choices,
	}
def process_choice_input(question, answer):
	opt = ""
	if answer:
		answer_selected = False
		for k, v in answer.items():
			if 'ANSWER' in v:
				answer_selected = True
		if answer_selected:
			for k, v in answer.items():
				if 'ANSWER' in v:
					if v['ANSWER'].startswith("_entry_"):
						if not answer[k]['COMMENT']:
							raise AnswerException('请输入文本框')
						else: 
							radio_val = v['ANSWER'].replace("_entry_", "")
							opt = radio_val + ":" + v['COMMENT']
					else:
						opt = v['ANSWER']
	if question.required and not opt:
		raise AnswerException('必须选择一个选项')
	if question.regex:
		if regex_check(question.regex, opt):
			pass
		else:
			raise AnswerException(question.errmsg)
	return opt
#checkbox
def question_checkbox(request, question):
	choices = []
	for choice in question.choices():
		choices.append(choice)
	return {
		'choices': choices,
	}
def process_checkbox(question, answer):
	multiple = []
	if answer:
		for key, value in answer.items():
			multiple.append(value)
	if question.required and not multiple:
		raise AnswerException('必须选择一个选项')
	if question.regex:
		for opt in multiple:
			if regex_check(question.regex, opt):
				pass
			else:
				raise AnswerException(question.errmsg)
	return multiple

#text, textarea
def question_text(request, question):
	return []
	
def process_text(question, answer):
	opt = ""
	if answer and 'ANSWER' in answer:
		opt = answer['ANSWER']
	if question.required and not opt:
		raise AnswerException('请输入文本')
	if question.regex:
		if regex_check(question.regex, opt):
			pass
		else:
			raise AnswerException(question.errmsg)
	return opt

#for processing questions: supply additional information to the templates
QuestionProcessors = {}
#for processing answers
Processors = {} 

#choice
QuestionProcessors['choice'] = question_choice
Processors['choice'] = process_choice
#choice-input
QuestionProcessors['choice-input'] = question_choice_input
Processors['choice-input'] = process_choice_input
#checkbox
QuestionProcessors['checkbox'] = question_checkbox
Processors['checkbox'] = process_checkbox
#text, textarea
QuestionProcessors['text'] = question_text
Processors['text'] = process_text
QuestionProcessors['textarea'] = question_text
Processors['textarea'] = process_text

