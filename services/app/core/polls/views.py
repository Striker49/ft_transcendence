from django.shortcuts import get_object_or_404, render
from django.http import HttpResponse, HttpResponseRedirect
from .models import Question, Choice
from django.http import Http404
from django.db.models import F
from django.urls import reverse

# Create your views here.

# renders the index page for this app
def index(request):
	latest_question_list = Question.objects.order_by("-pub_date")[:5]
	context = {"latest_question_list": latest_question_list}
	return render(request, "polls/index.html", context)

# Gives the details for a given question id
def detail(request, question_id):
	# try:
	# 	question = Question.objects.get(pk=question_id)
	# except Question.DoesNotExist:
	# 	raise Http404("Question does not exist")
	question = get_object_or_404(Question, pk=question_id)
	context = {"question": question}
	return render(request, "polls/detail.html", context)

# Renders a page that shows the result
def results(request, question_id):
	question = get_object_or_404(Question, pk=question_id)
	context = {"question": question}
	return render(request, "polls/results.html", context)

# updates the database with the given selection and redirects to the results view function
def vote(request, question_id):
    question = get_object_or_404(Question, pk=question_id)
    try:
        selected_choice = question.choice_set.get(pk=request.POST["choice"])
    except (KeyError, Choice.DoesNotExist):
        return render(
			request,
			"polls/detail.html",
			{
				"question": question,
				"error_message": "You didn't select a choice.",
			}
		)
    else:
        selected_choice.votes = F("votes") + 1
        selected_choice.save()
    return HttpResponseRedirect(reverse("polls:results", args=(question.id,)))
