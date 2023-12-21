const  controlWrapper = ctrl => async (req, res, next) => {
      try {
         ctrl(req, res, next);
      } catch (error) {
         next(error);
      }
   }

export default controlWrapper;