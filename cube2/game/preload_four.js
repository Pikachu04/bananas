
var Module;

if (typeof Module === 'undefined') Module = eval('(function() { try { return Module || {} } catch(e) { return {} } })()');

if (!Module.expectedDataFileDownloads) {
  Module.expectedDataFileDownloads = 0;
  Module.finishedDataFileDownloads = 0;
}
Module.expectedDataFileDownloads++;
(function() {
 var loadPackage = function(metadata) {

    var decrunchWorker = new Worker('crunch-worker.js');
    var decrunchCallbacks = [];
    decrunchWorker.onmessage = function(msg) {
      decrunchCallbacks[msg.data.callbackID](msg.data.data);
      console.log('decrunched ' + msg.data.filename + ' in ' + msg.data.time + ' ms, ' + msg.data.data.length + ' bytes');
      decrunchCallbacks[msg.data.callbackID] = null;
    };
    function requestDecrunch(filename, data, callback) {
      decrunchWorker.postMessage({
        filename: filename,
        data: new Uint8Array(data),
        callbackID: decrunchCallbacks.length
      });
      decrunchCallbacks.push(callback);
    }

    var PACKAGE_PATH;
    if (typeof window === 'object') {
      PACKAGE_PATH = window['encodeURIComponent'](window.location.pathname.toString().substring(0, window.location.pathname.toString().lastIndexOf('/')) + '/');
    } else if (typeof location !== 'undefined') {
      // worker
      PACKAGE_PATH = encodeURIComponent(location.pathname.toString().substring(0, location.pathname.toString().lastIndexOf('/')) + '/');
    } else {
      throw 'using preloaded data can only be done on a web page or in a web worker';
    }
    var PACKAGE_NAME = 'four.data';
    var REMOTE_PACKAGE_BASE = 'four.data';
    if (typeof Module['locateFilePackage'] === 'function' && !Module['locateFile']) {
      Module['locateFile'] = Module['locateFilePackage'];
      Module.printErr('warning: you defined Module.locateFilePackage, that has been renamed to Module.locateFile (using your locateFilePackage for now)');
    }
    var REMOTE_PACKAGE_NAME = typeof Module['locateFile'] === 'function' ?
                              Module['locateFile'](REMOTE_PACKAGE_BASE) :
                              ((Module['filePackagePrefixURL'] || '') + REMOTE_PACKAGE_BASE);
  
    var REMOTE_PACKAGE_SIZE = metadata.remote_package_size;
    var PACKAGE_UUID = metadata.package_uuid;
  
    function fetchRemotePackage(packageName, packageSize, callback, errback) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', packageName, true);
      xhr.responseType = 'arraybuffer';
      xhr.onprogress = function(event) {
        var url = packageName;
        var size = packageSize;
        if (event.total) size = event.total;
        if (event.loaded) {
          if (!xhr.addedTotal) {
            xhr.addedTotal = true;
            if (!Module.dataFileDownloads) Module.dataFileDownloads = {};
            Module.dataFileDownloads[url] = {
              loaded: event.loaded,
              total: size
            };
          } else {
            Module.dataFileDownloads[url].loaded = event.loaded;
          }
          var total = 0;
          var loaded = 0;
          var num = 0;
          for (var download in Module.dataFileDownloads) {
          var data = Module.dataFileDownloads[download];
            total += data.total;
            loaded += data.loaded;
            num++;
          }
          total = Math.ceil(total * Module.expectedDataFileDownloads/num);
          if (Module['setStatus']) Module['setStatus']('Downloading data... (' + loaded + '/' + total + ')');
        } else if (!Module.dataFileDownloads) {
          if (Module['setStatus']) Module['setStatus']('Downloading data...');
        }
      };
      xhr.onerror = function(event) {
        throw new Error("NetworkError for: " + packageName);
      }
      xhr.onload = function(event) {
        if (xhr.status == 200 || xhr.status == 304 || xhr.status == 206 || (xhr.status == 0 && xhr.response)) { // file URLs can return 0
          var packageData = xhr.response;
          callback(packageData);
        } else {
          throw new Error(xhr.statusText + " : " + xhr.responseURL);
        }
      };
      xhr.send(null);
    };

    function handleError(error) {
      console.error('package error:', error);
    };
  
      var fetched = null, fetchedCallback = null;
      fetchRemotePackage(REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE, function(data) {
        if (fetchedCallback) {
          fetchedCallback(data);
          fetchedCallback = null;
        } else {
          fetched = data;
        }
      }, handleError);
    
  function runWithFS() {

    function assert(check, msg) {
      if (!check) throw msg + new Error().stack;
    }
Module['FS_createPath']('/', 'packages', true, true);
Module['FS_createPath']('/packages', 'gk', true, true);
Module['FS_createPath']('/packages/gk', 'cyber', true, true);
Module['FS_createPath']('/packages/gk/cyber', 'plain_colors', true, true);
Module['FS_createPath']('/packages/gk/cyber', 'glow_colors', true, true);
Module['FS_createPath']('/packages/gk/cyber', 'cyberskydark', true, true);
Module['FS_createPath']('/packages/gk/cyber', 'cybersky', true, true);
Module['FS_createPath']('/packages', 'base', true, true);

    function DataRequest(start, end, crunched, audio) {
      this.start = start;
      this.end = end;
      this.crunched = crunched;
      this.audio = audio;
    }
    DataRequest.prototype = {
      requests: {},
      open: function(mode, name) {
        this.name = name;
        this.requests[name] = this;
        Module['addRunDependency']('fp ' + this.name);
      },
      send: function() {},
      onload: function() {
        var byteArray = this.byteArray.subarray(this.start, this.end);

        if (this.crunched) {
          var ddsHeader = byteArray.subarray(0, 128);
          var that = this;
          requestDecrunch(this.name, byteArray.subarray(128), function(ddsData) {
            byteArray = new Uint8Array(ddsHeader.length + ddsData.length);
            byteArray.set(ddsHeader, 0);
            byteArray.set(ddsData, 128);
            that.finish(byteArray);
          });
        } else {

          this.finish(byteArray);

        }

      },
      finish: function(byteArray) {
        var that = this;

        Module['FS_createPreloadedFile'](this.name, null, byteArray, true, true, function() {
          Module['removeRunDependency']('fp ' + that.name);
        }, function() {
          if (that.audio) {
            Module['removeRunDependency']('fp ' + that.name); // workaround for chromium bug 124926 (still no audio with this, but at least we don't hang)
          } else {
            Module.printErr('Preloading file ' + that.name + ' failed');
          }
        }, false, true); // canOwn this data in the filesystem, it is a slide into the heap that will never change

        this.requests[this.name] = null;
      },
    };

        var files = metadata.files;
        for (i = 0; i < files.length; ++i) {
          new DataRequest(files[i].start, files[i].end, files[i].crunched, files[i].audio).open('GET', files[i].filename);
        }

  
    function processPackageData(arrayBuffer) {
      Module.finishedDataFileDownloads++;
      assert(arrayBuffer, 'Loading data file failed.');
      assert(arrayBuffer instanceof ArrayBuffer, 'bad input to processPackageData');
      var byteArray = new Uint8Array(arrayBuffer);
      var curr;
      
        // copy the entire loaded file into a spot in the heap. Files will refer to slices in that. They cannot be freed though
        // (we may be allocating before malloc is ready, during startup).
        if (Module['SPLIT_MEMORY']) Module.printErr('warning: you should run the file packager with --no-heap-copy when SPLIT_MEMORY is used, otherwise copying into the heap may fail due to the splitting');
        var ptr = Module['getMemory'](byteArray.length);
        Module['HEAPU8'].set(byteArray, ptr);
        DataRequest.prototype.byteArray = Module['HEAPU8'].subarray(ptr, ptr+byteArray.length);
  
          var files = metadata.files;
          for (i = 0; i < files.length; ++i) {
            DataRequest.prototype.requests[files[i].filename].onload();
          }
              Module['removeRunDependency']('datafile_four.data');

    };
    Module['addRunDependency']('datafile_four.data');
  
    if (!Module.preloadResults) Module.preloadResults = {};
  
      Module.preloadResults[PACKAGE_NAME] = {fromCache: false};
      if (fetched) {
        processPackageData(fetched);
        fetched = null;
      } else {
        fetchedCallback = processPackageData;
      }
    
  }
  if (Module['calledRun']) {
    runWithFS();
  } else {
    if (!Module['preRun']) Module['preRun'] = [];
    Module["preRun"].push(runWithFS); // FS is not initialized yet, wait for it
  }

  if (!Module['postRun']) Module['postRun'] = [];
  Module["postRun"].push(function() {
    decrunchWorker.terminate();
  });

 }
 loadPackage({"files": [{"audio": 0, "start": 0, "crunched": 0, "end": 2860, "filename": "/packages/gk/cyber/plain_colors/plain_color_02_cc.png"}, {"audio": 0, "start": 2860, "crunched": 0, "end": 5720, "filename": "/packages/gk/cyber/plain_colors/plain_color_03_cc.png"}, {"audio": 0, "start": 5720, "crunched": 0, "end": 7271, "filename": "/packages/gk/cyber/plain_colors/package.cfg"}, {"audio": 0, "start": 7271, "crunched": 0, "end": 10132, "filename": "/packages/gk/cyber/plain_colors/plain_color_04_cc.png"}, {"audio": 0, "start": 10132, "crunched": 0, "end": 12992, "filename": "/packages/gk/cyber/plain_colors/plain_color_05_cc.png"}, {"audio": 0, "start": 12992, "crunched": 0, "end": 15851, "filename": "/packages/gk/cyber/plain_colors/plain_color_01_cc.png"}, {"audio": 0, "start": 15851, "crunched": 0, "end": 18708, "filename": "/packages/gk/cyber/plain_colors/plain_color_nm.png"}, {"audio": 0, "start": 18708, "crunched": 0, "end": 26570, "filename": "/packages/gk/cyber/plain_colors/plain_color_01_sc.png"}, {"audio": 0, "start": 26570, "crunched": 0, "end": 30154, "filename": "/packages/gk/cyber/plain_colors/Thumbs.db"}, {"audio": 0, "start": 30154, "crunched": 0, "end": 33012, "filename": "/packages/gk/cyber/glow_colors/glow_color_05.png"}, {"audio": 0, "start": 33012, "crunched": 0, "end": 34765, "filename": "/packages/gk/cyber/glow_colors/package.cfg"}, {"audio": 0, "start": 34765, "crunched": 0, "end": 37624, "filename": "/packages/gk/cyber/glow_colors/glow_color_04.png"}, {"audio": 0, "start": 37624, "crunched": 0, "end": 40485, "filename": "/packages/gk/cyber/glow_colors/glow_color_01.png"}, {"audio": 0, "start": 40485, "crunched": 0, "end": 48347, "filename": "/packages/gk/cyber/glow_colors/glow_color_01_sc.png"}, {"audio": 0, "start": 48347, "crunched": 0, "end": 51204, "filename": "/packages/gk/cyber/glow_colors/glow_color_nm.png"}, {"audio": 0, "start": 51204, "crunched": 0, "end": 54063, "filename": "/packages/gk/cyber/glow_colors/glow_color_03.png"}, {"audio": 0, "start": 54063, "crunched": 0, "end": 59436, "filename": "/packages/gk/cyber/glow_colors/glow_color_box_01_gc.png"}, {"audio": 0, "start": 59436, "crunched": 0, "end": 69013, "filename": "/packages/gk/cyber/glow_colors/glow_color_box_01_cc.png"}, {"audio": 0, "start": 69013, "crunched": 0, "end": 71873, "filename": "/packages/gk/cyber/glow_colors/glow_color_02.png"}, {"audio": 0, "start": 71873, "crunched": 0, "end": 78017, "filename": "/packages/gk/cyber/glow_colors/Thumbs.db"}, {"audio": 0, "start": 78017, "crunched": 0, "end": 818993, "filename": "/packages/gk/cyber/cyberskydark/gkskycyber_up.png"}, {"audio": 0, "start": 818993, "crunched": 0, "end": 1649715, "filename": "/packages/gk/cyber/cyberskydark/gkskycyber_lf.png"}, {"audio": 0, "start": 1649715, "crunched": 0, "end": 2466589, "filename": "/packages/gk/cyber/cyberskydark/gkskycyber_rt.png"}, {"audio": 0, "start": 2466589, "crunched": 0, "end": 3212138, "filename": "/packages/gk/cyber/cyberskydark/gkskycyber_dn.png"}, {"audio": 0, "start": 3212138, "crunched": 0, "end": 4049885, "filename": "/packages/gk/cyber/cyberskydark/gkskycyber_bk.png"}, {"audio": 0, "start": 4049885, "crunched": 0, "end": 4879100, "filename": "/packages/gk/cyber/cyberskydark/gkskycyber_ft.png"}, {"audio": 0, "start": 4879100, "crunched": 0, "end": 5053514, "filename": "/packages/gk/cyber/cybersky/gkskycyber_up.jpg"}, {"audio": 0, "start": 5053514, "crunched": 0, "end": 5239196, "filename": "/packages/gk/cyber/cybersky/gkskycyber_rt.jpg"}, {"audio": 0, "start": 5239196, "crunched": 0, "end": 5425708, "filename": "/packages/gk/cyber/cybersky/gkskycyber_bk.jpg"}, {"audio": 0, "start": 5425708, "crunched": 0, "end": 5584285, "filename": "/packages/gk/cyber/cybersky/gkskycyber_dn.jpg"}, {"audio": 0, "start": 5584285, "crunched": 0, "end": 5769936, "filename": "/packages/gk/cyber/cybersky/gkskycyber_lf.jpg"}, {"audio": 0, "start": 5769936, "crunched": 0, "end": 5953370, "filename": "/packages/gk/cyber/cybersky/gkskycyber_ft.jpg"}, {"audio": 0, "start": 5953370, "crunched": 0, "end": 6451084, "filename": "/packages/base/cyber1.ogz"}, {"audio": 0, "start": 6451084, "crunched": 0, "end": 6451388, "filename": "/packages/base/cyber1.cfg"}, {"audio": 0, "start": 6451388, "crunched": 0, "end": 6469684, "filename": "/packages/base/cyber1.wpt"}], "remote_package_size": 6469684, "package_uuid": "ad69a93d-4453-4e63-b5d3-b321e03846bd"});

})();

