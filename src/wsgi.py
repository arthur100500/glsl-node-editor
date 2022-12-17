import os, sys
from app import create_app

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

app = create_app()

if __name__ == "__main__":
    app.run()
