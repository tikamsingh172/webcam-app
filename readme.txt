To generate OTP : https://4wex2d2cz0.execute-api.ap-south-1.amazonaws.com/default/lambda-staff-login

To validate OTP: https://218j49ra6l.execute-api.ap-south-1.amazonaws.com/default/lambda-staff-login-validate

To generate OTP: {"phone_number": "+919741116035"}

To validate OTP: Response from generate otp api
{
"session": " ",
"challengeParameters": {
"USERNAME": " ",
"answer": " "
}
}

Image Upload API: PUT
https://eww5a3ve13.execute-api.ap-south-1.amazonaws.com/default/lambda-upload-image-trigger

params
bucket='face-mementos' & property_folder='molecule_club_ifc' & qt_folder= 'qt_faces'  & camera_folder='camera_1' & filename='Molecule_Cam1_1.jpg'

Attach Image jpg file as binary

Authentication: Bearer Token: id_token
