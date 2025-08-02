FROM python:3.10

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY . /code

RUN echo '#!/bin/bash\n\
echo "Starting MLflow server..."\n\
mlflow db upgrade sqlite:////code/mlruns/mlflow.db\n\
mlflow server --host 0.0.0.0 --port 5001 --backend-store-uri sqlite:////code/mlruns/mlflow.db &\n\
sleep 5\n\
echo "Starting recommendation pipeline..."\n\
python scheduled_task.py' > /code/start.sh

RUN chmod +x /code/start.sh

CMD ["/code/start.sh"]
