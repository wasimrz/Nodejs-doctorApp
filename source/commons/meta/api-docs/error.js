module.exports = [
  {
    "summary": "Bad Request",
    "value": {
      "status": 400,
      "type": "failure",
      "message": "Ain't you forgetting something in request ?"
    }
  },
  {
    "summary": "Unauthorized",
    "value": {
      "status": 401,
      "type": "failure",
      "message": "Hold on smarty pants, I'm calling 911 :P"
    }
  },
  {
    "summary": "Forbidden",
    "value": {
      "status": 403,
      "type": "failure",
      "message": "Hold up! You can't go in there..."
    }
  },
  {
    "summary": "Internal Server Error",
    "value": {
      "status": 500,
      "type": "failure",
      "message": "Oww Snap!! It's not you, it's us. Try in a bit."
    }
  }, 
  {
    "summary": "Expired",
    "value": {
      "status": 498,
      "type": "failure",
      "message": "Your ticket to resource is expired!"
    }
  }, 
]