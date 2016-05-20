class AnswerException(Exception):
	"""Thrown from an answer processor to generate an error message"""
	pass
	
#define different types of questions
QuestionChoices = [
	('choice', 'A list of choices to choose from'),
	('choice-input', 'A list of choices with input text to choose from'),
	('checkbox', 'A list of checkboxes to choose from')
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
	if not answer:
		raise AnswerException('必须选择一个选项')
	elif 'ANSWER' not in answer:
		raise AnswerException('必须选择一个选项')
	opt = answer['ANSWER']
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
	if not answer:
		raise AnswerException('必须选择一个选项')
	elif 'ANSWER' not in answer:
		raise AnswerException('必须选择一个选项')
	opt = answer['ANSWER']
	if opt == "_entry_":
		if 'COMMENT' not in answer:
			raise AnswerException('请输入文本框')
		opt = answer['COMMENT']
		if not opt:
			raise AnswerException('请输入文本框')
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
	if not answer:
		raise AnswerException('必须选择一个选项')
	multiple = []
	for key, value in answer.items():
		multiple.append(value)
	return multiple

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



