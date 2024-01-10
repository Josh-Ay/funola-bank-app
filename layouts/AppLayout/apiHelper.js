export const handleAPICallAndSubsequentStateUpdate = async (
    apiCallFunction,
    dataToPost,
    copyOfStateBeingTracked,
    updateStateBeingTracked,
    handleApiSuccess,
    handleApiFailure,
    extraDataParam=null,
    addItemAtBeginningOfStateBeingTracked=false,
    typeOfState=null,
) => {
    try {
            
        const res = extraDataParam ? 
            (await apiCallFunction(dataToPost, extraDataParam)).data
        : 
        (await apiCallFunction(dataToPost)).data;

        handleApiSuccess();

        if (Array.isArray(copyOfStateBeingTracked)) {
            if (addItemAtBeginningOfStateBeingTracked) {
                copyOfStateBeingTracked.unshift(res);
                updateStateBeingTracked(copyOfStateBeingTracked);
                return
            }
            
            copyOfStateBeingTracked.push(res);
            updateStateBeingTracked(copyOfStateBeingTracked);
        }

    } catch (error) {
        const errorMsg = error.response ? error.response.data : error.message;
        handleApiFailure(
            errorMsg.toLocaleLowerCase().includes('html') ? 
                'Something went wrong. Please try again' 
                : 
            errorMsg
        );
    }
}