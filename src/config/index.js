const BASE_CONFIG = {
  qqMapKey: '3I4BZ-GMSLW-UUKRC-RUO2N-NXMG2-IMBJZ'
}

const CONFIG = {
  // 开发版
  develop: {
    env: 'dev',
    // api: 'https://mp.activity.zenyuca.cn',
    api: 'https://dev.sanduanlun.cn:8000',
    uploadUrl: 'https://dev.sanduanlun.cn:8000/upload_file', // 上传接口
    fileUrl: 'https://dev.sanduanlun.cn:8000'
  },
  // 体验版
  trial: {
    env: 'test',
    api: 'https://dev.sanduanlun.cn:8000',
    uploadUrl: 'https://dev.sanduanlun.cn:8000/upload_file', // 上传接口
    fileUrl: 'https://dev.sanduanlun.cn:8000'
  },
  // 正式版
  release: {
    env: 'prod',
    api: 'https://api.sanduanlun.cn:8000',
    uploadUrl: 'https://api.sanduanlun.cn:8000/upload_file', // 上传接口
    fileUrl: 'https://api.sanduanlun.cn:8000'
  }
}
export default {...BASE_CONFIG, ...CONFIG['develop']}
