const avatarRenamer = (filenane, username)=>{
   const idx = filenane.indexOf('_');
   const preffix = filenane.slice(0, idx+1);
   const ext = filenane.split(".").pop();
   return `${preffix}${username}.${ext}`
}

export default avatarRenamer;