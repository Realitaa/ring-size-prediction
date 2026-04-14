from rest_framework.decorators import api_view
from rest_framework.response import Response
from .services.finger_detection import process_image_opencv

@api_view(['POST'])
def process_image(request):
    try:
        file = request.FILES.get('image')

        if not file:
            return Response({"error": "No image uploaded"}, status=400)

        result = process_image_opencv(file.read())

        return Response({
            "success": True,
            "data": result
        })

    except Exception as e:
        return Response({
            "success": False,
            "error": str(e)
        }, status=500)