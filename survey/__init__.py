from survey.qprocessors.choice import question_choice

#define different types of questions
QuestionChoices = [
	('choice', 'A list of choices to choose from')
]
#for processing questions: supply additional information to the templates
QuestionProcessors = {}
#for processing answers
Processors = {} 

QuestionProcessors['choice'] = question_choice