from django.shortcuts import get_object_or_404, render
from django.http import HttpResponse, HttpResponseRedirect
from django.db.models import F
from django.urls import reverse
from django.views import generic

from .models import Question, Choice
# Create your views here.

# renders the index page for this app
class IndexView(generic.ListView):
	template_name = "polls2/index.html"
	context_object_name = "latest_question_list"

	def get_queryset(self):
		return Question.objects.order_by("-pub_date")[:5]

# Gives the details for a given question id
class DetailView(generic.DetailView):
	model = Question
	template_name = "polls2/detail.html"

# Renders a page that shows the result
class ResultsView(generic.DetailView):
	model = Question
	template_name = "polls2/results.html"

# updates the database with the given selection and redirects to the results view function
def vote(request, question_id):
    question = get_object_or_404(Question, pk=question_id)
    try:
        selected_choice = question.choice_set.get(pk=request.POST["choice"])
    except (KeyError, Choice.DoesNotExist):
        return render(
			request,
			"polls2/detail.html",
			{
				"question": question,
				"error_message": "You didn't select a choice.",
			}
		)
    else:
        selected_choice.votes = F("votes") + 1
        selected_choice.save()
    return HttpResponseRedirect(reverse("polls2:results", args=(question.id,)))