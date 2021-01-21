let tcbEnv = window._tcbEnv || {
  TCB_SERVICE_DOMAIN: '',
  TCB_ENV_ID: '',
  TCB_DOMAIN: '',
};
if (tcbEnv.TCB_SERVICE_DOMAIN.length) {
  const arr = tcbEnv.TCB_SERVICE_DOMAIN.split('.');
  const TCB_DOMAIN = `https://${arr[0]}.tcloudbaseapp.com`;
  tcbEnv = { ...tcbEnv, TCB_DOMAIN };
}

export default tcbEnv;
