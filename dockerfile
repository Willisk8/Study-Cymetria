FROM python:latest

WORKDIR /project

COPY . /project

RUN pip install -r requirements.txt

CMD ["python3", "server.py"]