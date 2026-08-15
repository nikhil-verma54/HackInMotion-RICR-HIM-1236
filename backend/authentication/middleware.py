from .models import UserProfile


class FirebaseSessionMiddleware:
    """If a Django session contains `firebase_uid`, attach the corresponding
    `UserProfile` to `request.user` so DRF's SessionAuthentication works as a
    fallback for browser requests.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):

        try:
            user = getattr(request, "user", None)

            if (not user) or getattr(user, "is_anonymous", True):
                firebase_uid = request.session.get("firebase_uid")

                if firebase_uid:
                    try:
                        profile = UserProfile.objects.filter(firebase_uid=firebase_uid).first()

                        if profile:
                            request.user = profile
                    except Exception:
                        pass
        except Exception:
            pass

        return self.get_response(request)
