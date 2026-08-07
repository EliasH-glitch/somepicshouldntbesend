async function getDeviceProfile() {
    // Helper to safely extract GPU/WebGL info without throwing errors
    function getGPUInfo() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (!gl) return { vendor: 'Not Supported', renderer: 'Not Supported' };
            
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            if (!debugInfo) return { vendor: 'Restricted', renderer: 'Restricted' };

            return {
                vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
                renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
            };
        } catch (e) {
            return { vendor: 'Error', renderer: 'Error' };
        }
    }

    const gpu = getGPUInfo();
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection || {};

    // Build the dictionary object
    const deviceProfile = {
        browser: {
            userAgent: navigator.userAgent,
            userAgentData: navigator.userAgentData ? {
                brands: navigator.userAgentData.brands,
                mobile: navigator.userAgentData.mobile,
                platform: navigator.userAgentData.platform
            } : null,
            language: navigator.language,
            languages: navigator.languages,
            platform: navigator.platform,
            doNotTrack: navigator.doNotTrack || window.doNotTrack || navigator.vendor,
            cookiesEnabled: navigator.cookieEnabled
        },
        display: {
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            availWidth: window.screen.availWidth,
            availHeight: window.screen.availHeight,
            colorDepth: window.screen.colorDepth,
            pixelDepth: window.screen.pixelDepth,
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
            orientation: screen.orientation ? screen.orientation.type : 'Unknown'
        },
        hardware: {
            logicalCores: navigator.hardwareConcurrency || 'Unknown',
            deviceMemoryGB: navigator.deviceMemory || 'Unknown',
            maxTouchPoints: navigator.maxTouchPoints || 0,
            gpuVendor: gpu.vendor,
            gpuRenderer: gpu.renderer
        },
        network: {
            online: navigator.onLine,
            effectiveType: connection.effectiveType || 'Unknown',
            downlinkMbps: connection.downlink || 'Unknown',
            rttMs: connection.rtt || 'Unknown',
            saveData: connection.saveData || false
        },
        localization: {
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            timeZoneOffsetMinutes: new Date().getTimezoneOffset()
        }
    };

    return deviceProfile;
}

// Example usage:
getDeviceProfile().then(profile => {
    console.log("Device Profile Dictionary:", profile);
});

async function sendDeviceProfileByEmail() {
    // 1. Gather the profile data (using the function from before)
    const profile = await getDeviceProfile(); 

    try {
        // 2. Send the data to your backend server via HTTP POST
        const response = await fetch('/api/send-device-info', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(profile)
        });

        if (response.ok) {
            console.log('Device profile successfully sent via backend!');
        } else {
            console.error('Failed to send device profile.');
        }
    } catch (error) {
        console.error('Network or server error:', error);
    }
}

// Trigger it automatically when the page loads (optional)
window.addEventListener('load', sendDeviceProfileByEmail);