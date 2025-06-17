export function getErrorMessage(error: any) {
  let message = "";
  if (error.response) {
    message = error.response.data.message;
  } else if (error.request) {
    message = "Não foi possível se conectar ao servidor";
  } else {
    message = error.message;
  }
  return { message };
}
