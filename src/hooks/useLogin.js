import React, { useEffect, useState } from 'react';
import cloudFunc from '@/utils/cloudFunc';

function useLogin() {
    const [isLogin, ] = useState(()=>{
        return cloudFunc.checkHasLogin();
    })
    return isLogin;
}

export default useLogin;
