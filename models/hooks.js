export const handleSaveError = (error, data, next) => {
   const { code } = { error };
   error.status = (code === 11000) ? 409 : 400;
   next();
};

export const preUpdate = function (next) {
   this.options.new = true;
   this.options.runValidators = true;
   next();
};
