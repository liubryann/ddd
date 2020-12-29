export FLASK_APP=server.py
gunicorn -e GOOGLE_APPLICATION_CREDENTIALS="../../../../../Documents/Due_Diligence_for_Dummies-5fc904d43a26.json" server:app