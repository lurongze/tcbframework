let tcbEnv = window._tcbEnv || {
  TCB_SERVICE_DOMAIN:
    'ad-6gycgrvu66b9cae2-1253286615.ap-shanghai.service.tcloudbase.com',
  TCB_ENV_ID: 'wt-share-43bafa',
  TCB_DOMAIN: '',
};
if (tcbEnv.TCB_SERVICE_DOMAIN.length) {
  const arr = tcbEnv.TCB_SERVICE_DOMAIN.split('.');
  const TCB_DOMAIN = `https://${arr[0]}.tcloudbaseapp.com`;
  tcbEnv = { ...tcbEnv, TCB_DOMAIN };
}

export default tcbEnv;
