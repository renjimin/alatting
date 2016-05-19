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
	opt = answer or ''
	if not opt:
		raise AnswerException('You must select an option')
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

#for processing questions: supply additional information to the templates
QuestionProcessors = {}
#for processing answers
Processors = {} 

#choice
QuestionProcessors['choice'] = question_choice
Processors['choice'] = process_choice

#choice-input
QuestionProcessors['choice-input'] = question_choice_input
Processors['choice-input'] = process_choice


