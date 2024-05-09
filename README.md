# URSE - Automated GRADE approach


## Instructions for Installation

Firstly, you'll need to install [Robot Reviewer](https://github.com/ijmarshall/robotreviewer) . As there are integrations with Robot Reviewer that are mandatory for URSE to function correctly, it's essential to install it before running URSE.

Afterward, you can proceed with this installation. The "agc" and "server" folders represent the frontend and backend applications respectively.

To run the frontend:

- Navigate to the "agc" folder.
- Execute the following commands:
  - `npm install`
  - `npm run start`


To run the backend:

- Set up a virtual environment using:
    - `python -m venv venv`
- Install the required dependencies by running:
    - `pip install -r requirements.txt`
- Launch the backend with:
    - `python run.py`
