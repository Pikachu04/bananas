
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
    var PACKAGE_NAME = 'medium.data';
    var REMOTE_PACKAGE_BASE = 'medium.data';
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
Module['FS_createPath']('/packages', 'base', true, true);
Module['FS_createPath']('/packages', 'gk', true, true);
Module['FS_createPath']('/packages/gk', 'fantasy', true, true);
Module['FS_createPath']('/packages/gk/fantasy', 'skyfantasyJPG', true, true);
Module['FS_createPath']('/packages/gk/fantasy', 'castell_plaster_gk_v01', true, true);
Module['FS_createPath']('/packages/gk/fantasy', 'wooden_planks_gk_v01', true, true);
Module['FS_createPath']('/packages/gk/fantasy', 'castell_wall_trim_gk_v01', true, true);
Module['FS_createPath']('/packages/gk/fantasy', 'rock_formation_gk_v01', true, true);
Module['FS_createPath']('/packages/gk/fantasy', 'castell_wall_gk_v02', true, true);
Module['FS_createPath']('/packages/gk/fantasy', 'iron_intersection_gk_v01', true, true);
Module['FS_createPath']('/packages/gk/fantasy', 'castell_wall_gk_v01', true, true);
Module['FS_createPath']('/packages/gk/fantasy', 'castell_wall_gk_v03', true, true);
Module['FS_createPath']('/packages/gk/fantasy', 'iron_trim_gk_v01', true, true);
Module['FS_createPath']('/packages/gk/fantasy', 'stone_ground_tiles_gk_v01', true, true);
Module['FS_createPath']('/packages/gk/fantasy', 'stone_ground_gk_v01', true, true);
Module['FS_createPath']('/packages/gk/fantasy', 'iron_plates_gk_v01', true, true);
Module['FS_createPath']('/packages/gk/fantasy', 'wooden_roof_tiles_gk_v01', true, true);
Module['FS_createPath']('/packages/gk/fantasy', 'rock_formation_gk_v02', true, true);

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
              Module['removeRunDependency']('datafile_medium.data');

    };
    Module['addRunDependency']('datafile_medium.data');
  
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
 loadPackage({"files": [{"audio": 0, "start": 0, "crunched": 0, "end": 4195600, "filename": "/packages/base/two_towers.ogz"}, {"audio": 0, "start": 4195600, "crunched": 0, "end": 4196688, "filename": "/packages/base/two_towers.cfg"}, {"audio": 0, "start": 4196688, "crunched": 0, "end": 4213217, "filename": "/packages/base/two_towers.wpt"}, {"audio": 0, "start": 4213217, "crunched": 0, "end": 4398668, "filename": "/packages/gk/fantasy/skyfantasyJPG/skyfantasy_dn.jpg"}, {"audio": 0, "start": 4398668, "crunched": 0, "end": 4552503, "filename": "/packages/gk/fantasy/skyfantasyJPG/skyfantasy_ft.jpg"}, {"audio": 0, "start": 4552503, "crunched": 0, "end": 4701565, "filename": "/packages/gk/fantasy/skyfantasyJPG/skyfantasy_lf.jpg"}, {"audio": 0, "start": 4701565, "crunched": 0, "end": 4851004, "filename": "/packages/gk/fantasy/skyfantasyJPG/skyfantasy_rt.jpg"}, {"audio": 0, "start": 4851004, "crunched": 0, "end": 5007450, "filename": "/packages/gk/fantasy/skyfantasyJPG/skyfantasy_bk.jpg"}, {"audio": 0, "start": 5007450, "crunched": 0, "end": 5090291, "filename": "/packages/gk/fantasy/skyfantasyJPG/skyfantasy_up.jpg"}, {"audio": 0, "start": 5090291, "crunched": 0, "end": 5090738, "filename": "/packages/gk/fantasy/castell_plaster_gk_v01/package.cfg"}, {"audio": 0, "start": 5090738, "crunched": 0, "end": 5091472, "filename": "/packages/gk/fantasy/wooden_planks_gk_v01/package.cfg"}, {"audio": 0, "start": 5091472, "crunched": 0, "end": 5091896, "filename": "/packages/gk/fantasy/package.cfg"}, {"audio": 0, "start": 5091896, "crunched": 0, "end": 5092695, "filename": "/packages/gk/fantasy/castell_wall_trim_gk_v01/package.cfg"}, {"audio": 0, "start": 5092695, "crunched": 0, "end": 5093134, "filename": "/packages/gk/fantasy/rock_formation_gk_v01/package.cfg"}, {"audio": 0, "start": 5093134, "crunched": 0, "end": 5093853, "filename": "/packages/gk/fantasy/castell_wall_gk_v02/package.cfg"}, {"audio": 0, "start": 5093853, "crunched": 0, "end": 5094312, "filename": "/packages/gk/fantasy/iron_intersection_gk_v01/package.cfg"}, {"audio": 0, "start": 5094312, "crunched": 0, "end": 5095031, "filename": "/packages/gk/fantasy/castell_wall_gk_v01/package.cfg"}, {"audio": 0, "start": 5095031, "crunched": 0, "end": 5095750, "filename": "/packages/gk/fantasy/castell_wall_gk_v03/package.cfg"}, {"audio": 0, "start": 5095750, "crunched": 0, "end": 5096422, "filename": "/packages/gk/fantasy/iron_trim_gk_v01/package.cfg"}, {"audio": 0, "start": 5096422, "crunched": 0, "end": 5096893, "filename": "/packages/gk/fantasy/stone_ground_tiles_gk_v01/package.cfg"}, {"audio": 0, "start": 5096893, "crunched": 0, "end": 5097316, "filename": "/packages/gk/fantasy/stone_ground_gk_v01/package.cfg"}, {"audio": 0, "start": 5097316, "crunched": 0, "end": 5098018, "filename": "/packages/gk/fantasy/iron_plates_gk_v01/package.cfg"}, {"audio": 0, "start": 5098018, "crunched": 0, "end": 5098816, "filename": "/packages/gk/fantasy/wooden_roof_tiles_gk_v01/package.cfg"}, {"audio": 0, "start": 5098816, "crunched": 0, "end": 5099255, "filename": "/packages/gk/fantasy/rock_formation_gk_v02/package.cfg"}, {"audio": 0, "start": 5099255, "crunched": 1, "end": 5217877, "filename": "/packages/gk/fantasy/rock_formation_gk_v01/rock_formation_gk_v01_cc.dds"}, {"audio": 0, "start": 5217877, "crunched": 1, "end": 5236734, "filename": "/packages/gk/fantasy/rock_formation_gk_v01/rock_formation_gk_v01_nm.dds"}, {"audio": 0, "start": 5236734, "crunched": 1, "end": 5354811, "filename": "/packages/gk/fantasy/rock_formation_gk_v02/rock_formation_gk_v02_cc.dds"}, {"audio": 0, "start": 5354811, "crunched": 1, "end": 5373584, "filename": "/packages/gk/fantasy/rock_formation_gk_v02/rock_formation_gk_v02_nm.dds"}, {"audio": 0, "start": 5373584, "crunched": 1, "end": 5404515, "filename": "/packages/gk/fantasy/castell_wall_gk_v01/castell_wall_gk_v01_cc.dds"}, {"audio": 0, "start": 5404515, "crunched": 1, "end": 5434893, "filename": "/packages/gk/fantasy/castell_wall_gk_v01/castell_wall_gk_v01_nm.dds"}, {"audio": 0, "start": 5434893, "crunched": 1, "end": 5465265, "filename": "/packages/gk/fantasy/castell_wall_gk_v02/castell_wall_gk_v02_cc.dds"}, {"audio": 0, "start": 5465265, "crunched": 1, "end": 5483899, "filename": "/packages/gk/fantasy/castell_wall_gk_v02/castell_wall_gk_v02_nm.dds"}, {"audio": 0, "start": 5483899, "crunched": 1, "end": 5498743, "filename": "/packages/gk/fantasy/castell_wall_trim_gk_v01/castell_wall_trim_gk_v01_cc.dds"}, {"audio": 0, "start": 5498743, "crunched": 1, "end": 5512874, "filename": "/packages/gk/fantasy/castell_wall_trim_gk_v01/castell_wall_trim_gk_v01_nm.dds"}, {"audio": 0, "start": 5512874, "crunched": 1, "end": 5631748, "filename": "/packages/gk/fantasy/stone_ground_gk_v01/stone_ground_gk_v01_cc.dds"}, {"audio": 0, "start": 5631748, "crunched": 1, "end": 5701919, "filename": "/packages/gk/fantasy/stone_ground_gk_v01/stone_ground_gk_v01_nm.dds"}, {"audio": 0, "start": 5701919, "crunched": 1, "end": 5821025, "filename": "/packages/gk/fantasy/stone_ground_tiles_gk_v01/stone_ground_tiles_gk_v01_cc.dds"}, {"audio": 0, "start": 5821025, "crunched": 1, "end": 5852124, "filename": "/packages/gk/fantasy/stone_ground_tiles_gk_v01/stone_ground_tiles_gk_v01_nm.dds"}, {"audio": 0, "start": 5852124, "crunched": 1, "end": 5968500, "filename": "/packages/gk/fantasy/wooden_roof_tiles_gk_v01/wooden_roof_tiles_gk_v01_cc.dds"}, {"audio": 0, "start": 5968500, "crunched": 1, "end": 5999299, "filename": "/packages/gk/fantasy/wooden_roof_tiles_gk_v01/wooden_roof_tiles_gk_v01_nm.dds"}, {"audio": 0, "start": 5999299, "crunched": 1, "end": 6028166, "filename": "/packages/gk/fantasy/wooden_planks_gk_v01/wooden_planks_gk_v01_cc.dds"}, {"audio": 0, "start": 6028166, "crunched": 1, "end": 6056487, "filename": "/packages/gk/fantasy/wooden_planks_gk_v01/wooden_planks_gk_v01_nm.dds"}, {"audio": 0, "start": 6056487, "crunched": 1, "end": 6087364, "filename": "/packages/gk/fantasy/castell_plaster_gk_v01/castell_plaster_gk_v01_cc.dds"}, {"audio": 0, "start": 6087364, "crunched": 1, "end": 6117773, "filename": "/packages/gk/fantasy/castell_plaster_gk_v01/castell_plaster_gk_v01_nm.dds"}, {"audio": 0, "start": 6117773, "crunched": 1, "end": 6182735, "filename": "/packages/gk/fantasy/iron_plates_gk_v01/iron_plates_gk_v01_cc.dds"}, {"audio": 0, "start": 6182735, "crunched": 1, "end": 6247865, "filename": "/packages/gk/fantasy/iron_plates_gk_v01/iron_plates_gk_v01_nm.dds"}, {"audio": 0, "start": 6247865, "crunched": 1, "end": 6262710, "filename": "/packages/gk/fantasy/iron_trim_gk_v01/iron_trim_gk_v01_cc.dds"}, {"audio": 0, "start": 6262710, "crunched": 1, "end": 6277422, "filename": "/packages/gk/fantasy/iron_trim_gk_v01/iron_trim_gk_v01_nm.dds"}], "remote_package_size": 6277422, "package_uuid": "09ea74a4-d22e-4dc3-ba30-aa7a8dfdcec6"});

})();

