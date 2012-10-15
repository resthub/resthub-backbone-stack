({
    appDir: "../..",
    baseUrl: "js",
    dir: "../../target/build",
    
    optimizeCss: "standard.keepLines",
    mainConfigFile: "../main.js",
	
    inlineText: true,
    removeCombined: true,
    fileExclusionRegExp: /^_build/,
	
    modules: [
    {
        name: "main"
    }
    ]
})