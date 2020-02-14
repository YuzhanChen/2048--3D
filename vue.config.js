module.exports = {
    configureWebpack: {
        module:{
            rules:[
              {
                test:/\.(gltf|glb)$/,
                use: [
                  'file-loader',
                ],
              }
            ],
          }
    }
  }