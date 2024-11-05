const express = require('express');
const path = require('path');
const host = require('/system/display/host.json');
const theme = require('/system/display/store/theme.json');
const env = require('/system/display/store/env.json');
const { spawn } = require('child_process');

/*theme plugin*/
const pluginPath = require(`/system/display/store/themes/${theme.theme}/plugin.json`);
for (let i = 0; i < pluginPath.list.length;i++) require(`/system/display/store/themes/${theme.theme}/theme-plugin/${pluginPath.list[i]}`);


const loginPath = "/system/display/dmlogin"; 
const path_address = "/system/display";

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'content', 'index.html'));
});

app.get('/bellasdm/config.js', (req, res) => {
    res.json(host);
});

app.get('/bellasdm/data', (req, res) => {
    const filePath = path.join(__dirname, 'content', req.query.file);
    res.sendFile(filePath);
});

app.get('/bellasdm/theme-data', (req, res) => {
    const themeFilePath = path.join(path_address, 'store', 'themes', theme.theme, req.query.file);
    res.sendFile(themeFilePath);
});

const fs = require('fs');

app.post('/bellasdm/login', async (req, res) => {
    const { username, password, env } = req.body;
    const envPath = path.join('/system', 'display', 'store', 'env', env, 'uinit');
    const argv = [username, password, envPath];

    try {
        // Check if the loginPath exists
        await fs.promises.access(loginPath, fs.constants.F_OK);
    } catch (err) {
        console.error(`Executable not found: ${loginPath}`, err);
        return res.status(404).json({ error: 'Executable not found' });
    }

    let outputData = '';

    try {
        const child = spawn(loginPath, argv);

        // Handle stdout data
        child.stdout.on('data', (data) => {
            outputData += data.toString();
        });

        // Handle stderr data
        child.stderr.on('data', (errorData) => {
            console.error('stderr:', errorData.toString());
            // Only send the response once, if there's an error
            if (!res.headersSent) {
                return res.status(500).json({ error: errorData.toString() });
            }
            
        });

        child.on('error', (error) => {
            console.error('Error spawning child process:', error);
            // Only send the response once, if there's an error
            if (!res.headersSent) {
                return res.status(500).json({ error: 'Internal server error' });
            }
        });

        
        child.on('close', (code) => {
            console.log(`Child process exited with code ${code}`);
              
                if (code == 1) {
                    res.json({ content: code });
                }
                else if (code == 0) {
                    process.exit();
                }
            
            
        });

    } catch (error) {
        console.error('An error occurred while spawning the child process:', error);
        if (!res.headersSent) {
            return res.status(500).json({ error: 'Failed to execute login process' });
        }
    }

    
});

app.get('/bellasdm/get-env',(req,res) => {
    res.json(env);
    console.log(`${host.name}: get data from /bellasdm/get-env | OK`);
})

app.get('/bellasdm/select-env', (req, res) => {
    console.log("WRITE!");
    fs.writeFile("/system/display/store/env.json", JSON.stringify({
        list: env.list,
        env: req.query.env
    }), (err) => {
        if (err) {
            console.error("Error writing to file:", err);
            return res.status(500).send("Error writing to file");
        }
        console.log(`${host.name}: wrote to '/bellasdm/select-env' with ${req.query.env} | OK`);
        res.send("Environment updated successfully");
    });
});


app.listen(host.port, () => {
    console.log(`${host.name} | listening at ${host.port}`);
});

