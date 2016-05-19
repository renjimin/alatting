class AnswerException(Exception):
	"""Thrown from an answer processor to generate an error message"""
	pass
	
#define different types of questions
QuestionChoices = [
	('choice', 'A list of choices to choose from'),
	('choice-input', 'A list of choices with input text to choose from')
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
		raise AnswerException('You must select an option')
	elif 'ANSWER' not in answer:
		raise AnswerException('You must select an option')
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
		raise AnswerException('You must select an option')
	elif 'ANSWER' not in answer:
		raise AnswerException('You must select an option')
	opt = answer['ANSWER']
	if opt == "_entry_":
		opt = answer.get('comment','')
		if not opt:
			raise AnswerException('Field cannot be blank')
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


