import { supabase } from "./supabase";

export function getEmailUsername(emailAddress) {
    const atIndex = emailAddress.indexOf('@');
    if (atIndex !== -1) {
      return emailAddress.substring(0, atIndex);
    }
    // If no "@" found, return the entire email address
    return emailAddress;
}

export const getUserInfoByEmail =async (email) =>{
  try {
      const { data, error } = await supabase.rpc('get_user_info_by_email', { user_email : email });
      if(error){
          return {
            message: "Check your Internet Connection",
            success : false,
            data : null
          }
      }
      if (data.length==0) {
          return {
            message: "User not found",
            success : false,
            data : null
          }
      }
      return {
        message: "User not found",
        success : true,
        data : data[0]
      };
  } catch (err) {
      return {
        message: "Server Problem",
        success : false,
        data : null
      }
  }
}

export const recordCallHistory = async ({sender , receiver})=>{
  if(sender == receiver) return;
  try{
    const {error} = await supabase.from('calls').insert({'sender': sender, 'reciever': receiver});
    if(error) console.log(error);
  }catch(e){
    console.log(e);
  }
}