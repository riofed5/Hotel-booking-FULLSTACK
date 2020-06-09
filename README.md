# Resort Booking

## Requirement list before run this application:
* Node server
* MongoDB via (https://www.mongodb.com/cloud/atlas)
    * Remember to follow exact inital steps
    * Remember to allow IP address to access your Database(DB) ( via https://i.ibb.co/Prxrv1P/Screen-Shot-2020-06-09-at-21-14-19.png) 
   
## Instruction feature
* View rooms based on categories :
    * Room type: single, double, family, presidental
    * Number of guest
    * Room price
    * Room size
    * Other service: Pet allowance, breakfast
* Login and register for booking, cancel rooms.
* Booking rooms, cancel booking rooms ( only authentic account).
    
### Tech Stacks
* Language: Javascript, Html/Css
* ReactJS
* NodeJS
* MongoDB Cloud
* GraphQL

### Run the app
* Clone the respo: `git clone https://github.com/riofed5/Hotel-booking.git`
* Install packages: `npm install`
* Create file `nodemon.json` and then copy follow lines into `nodemon.json` file:

```
{
    "env":{
        "MONGO_USER": "your_user",
        "MONGO_PASSWORD": "your_password",
        "MONGO_DB": "name_of_db___whatever_you_can_name___"
    }
}
```
* Launch: `npm start`
* Navigate to `frontend folder` then launch: `npm start`
