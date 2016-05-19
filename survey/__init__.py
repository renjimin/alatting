from survey.qprocessors.choice import question_choice, question_choice_input

#define different types of questions
QuestionChoices = [
	('choice', 'A list of choices to choose from'),
	('choice-input', 'A list of choices with input text to choose from')
]
#for processing questions: supply additional information to the templates
QuestionProcessors = {}
#for processing answers
Processors = {} 

QuestionProcessors['choice'] = question_choice
QuestionProcessors['choice-input'] = question_choice_input