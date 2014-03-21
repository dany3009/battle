from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User


class UserCreationForm(UserCreationForm):
    username = forms.RegexField(label=("Username"), max_length=30,
            regex=r'^[\w.@+-]+$', help_text=(""),
            error_messages={'invalid': ("This value may contain only letters, "
                                        "numbers and @/./+/-/_ characters.")})
    password1 = forms.CharField(label=("Password"), widget=forms.PasswordInput)
    password2 = forms.CharField(label=("Password (again)"),
                                widget=forms.PasswordInput, help_text = (""))

    class Meta:
        model = User
        fields = ("username",)

    def clean_username(self):
        username = self.cleaned_data["username"]
        try:
            User.objects.get(username=username)
        except User.DoesNotExist:
            return username
        raise forms.ValidationError("A user with that username already exists.")

    def clean_password2(self):
        password1 = self.cleaned_data.get("password1", "")
        password2 = self.cleaned_data["password2"]
        if password1 != password2:
            raise forms.ValidationError("The two password fields didn't match.")
        return password2

    def save(self, commit=True):
        user = super(UserCreationForm, self).save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        user.is_active = True
        if commit:
            user.save()
        return user