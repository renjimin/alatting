def question_choice(request, question):
    choices = []
    
    for choice in question.choices():
        choices.append(choice)

    return {
        'choices': choices,
    }

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
    