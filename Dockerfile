FROM --platform=linux/amd64 python:3.10

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY . /code

# Create a startup script
RUN echo '#!/bin/bash\n\
    echo "Starting MLflow server..."\n\
    mlflow server --host 0.0.0.0 --port 5001 --backend-store-uri sqlite:///mlflow.db &\n\
    sleep 5\n\
    echo "Starting recommendation pipeline..."\n\
    python scheduled_task.py' > /code/start.sh

RUN chmod +x /code/start.sh

CMD ["/code/start.sh"]