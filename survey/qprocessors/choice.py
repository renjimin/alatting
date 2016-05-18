def question_choice(request, question):
    choices = []
    
    for choice in question.choices():
        choices.append(choice)

    return {
        'choices': choices,
    }