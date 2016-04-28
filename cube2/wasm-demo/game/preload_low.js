
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
    var PACKAGE_NAME = 'low.data';
    var REMOTE_PACKAGE_BASE = 'low.data';
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
Module['FS_createPath']('/packages', 'models', true, true);
Module['FS_createPath']('/packages/models', 'ffflag', true, true);
Module['FS_createPath']('/packages/models', 'ffpit', true, true);
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
      }
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
              Module['removeRunDependency']('datafile_low.data');

    };
    Module['addRunDependency']('datafile_low.data');
  
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
 loadPackage({"files": [{"audio": 0, "start": 0, "crunched": 0, "end": 554042, "filename": "/packages/base/colos.ogz"}, {"audio": 0, "start": 554042, "crunched": 0, "end": 555197, "filename": "/packages/base/colos.cfg"}, {"audio": 0, "start": 555197, "crunched": 0, "end": 566661, "filename": "/packages/base/colos.wpt"}, {"audio": 0, "start": 566661, "crunched": 0, "end": 566913, "filename": "/packages/models/ffflag/md5.cfg"}, {"audio": 0, "start": 566913, "crunched": 1, "end": 739870, "filename": "/packages/models/ffflag/ffflag_cc.dds"}, {"audio": 0, "start": 739870, "crunched": 1, "end": 896676, "filename": "/packages/models/ffflag/ffflag_sc.dds"}, {"audio": 0, "start": 896676, "crunched": 1, "end": 1050770, "filename": "/packages/models/ffflag/ffflag_nm.dds"}, {"audio": 0, "start": 1050770, "crunched": 0, "end": 1074191, "filename": "/packages/models/ffflag/ffflag.md5mesh"}, {"audio": 0, "start": 1074191, "crunched": 0, "end": 1165946, "filename": "/packages/models/ffflag/ffflag.md5anim"}, {"audio": 0, "start": 1165946, "crunched": 0, "end": 1166226, "filename": "/packages/models/ffpit/md5.cfg"}, {"audio": 0, "start": 1166226, "crunched": 1, "end": 1231582, "filename": "/packages/models/ffpit/ffpit_01_gk_sc.dds"}, {"audio": 0, "start": 1231582, "crunched": 1, "end": 1298901, "filename": "/packages/models/ffpit/ffpit_01_gk_nm.dds"}, {"audio": 0, "start": 1298901, "crunched": 1, "end": 1367081, "filename": "/packages/models/ffpit/ffpit_01_gk_cc.dds"}, {"audio": 0, "start": 1367081, "crunched": 0, "end": 1412278, "filename": "/packages/models/ffpit/ffpit.md5mesh"}, {"audio": 0, "start": 1412278, "crunched": 0, "end": 1597729, "filename": "/packages/gk/fantasy/skyfantasyJPG/skyfantasy_dn.jpg"}, {"audio": 0, "start": 1597729, "crunched": 0, "end": 1751564, "filename": "/packages/gk/fantasy/skyfantasyJPG/skyfantasy_ft.jpg"}, {"audio": 0, "start": 1751564, "crunched": 0, "end": 1900626, "filename": "/packages/gk/fantasy/skyfantasyJPG/skyfantasy_lf.jpg"}, {"audio": 0, "start": 1900626, "crunched": 0, "end": 2050065, "filename": "/packages/gk/fantasy/skyfantasyJPG/skyfantasy_rt.jpg"}, {"audio": 0, "start": 2050065, "crunched": 0, "end": 2206511, "filename": "/packages/gk/fantasy/skyfantasyJPG/skyfantasy_bk.jpg"}, {"audio": 0, "start": 2206511, "crunched": 0, "end": 2289352, "filename": "/packages/gk/fantasy/skyfantasyJPG/skyfantasy_up.jpg"}, {"audio": 0, "start": 2289352, "crunched": 0, "end": 2289799, "filename": "/packages/gk/fantasy/castell_plaster_gk_v01/package.cfg"}, {"audio": 0, "start": 2289799, "crunched": 0, "end": 2290533, "filename": "/packages/gk/fantasy/wooden_planks_gk_v01/package.cfg"}, {"audio": 0, "start": 2290533, "crunched": 0, "end": 2290957, "filename": "/packages/gk/fantasy/package.cfg"}, {"audio": 0, "start": 2290957, "crunched": 0, "end": 2291756, "filename": "/packages/gk/fantasy/castell_wall_trim_gk_v01/package.cfg"}, {"audio": 0, "start": 2291756, "crunched": 0, "end": 2292195, "filename": "/packages/gk/fantasy/rock_formation_gk_v01/package.cfg"}, {"audio": 0, "start": 2292195, "crunched": 0, "end": 2292914, "filename": "/packages/gk/fantasy/castell_wall_gk_v02/package.cfg"}, {"audio": 0, "start": 2292914, "crunched": 0, "end": 2293373, "filename": "/packages/gk/fantasy/iron_intersection_gk_v01/package.cfg"}, {"audio": 0, "start": 2293373, "crunched": 0, "end": 2294092, "filename": "/packages/gk/fantasy/castell_wall_gk_v01/package.cfg"}, {"audio": 0, "start": 2294092, "crunched": 0, "end": 2294811, "filename": "/packages/gk/fantasy/castell_wall_gk_v03/package.cfg"}, {"audio": 0, "start": 2294811, "crunched": 0, "end": 2295483, "filename": "/packages/gk/fantasy/iron_trim_gk_v01/package.cfg"}, {"audio": 0, "start": 2295483, "crunched": 0, "end": 2295954, "filename": "/packages/gk/fantasy/stone_ground_tiles_gk_v01/package.cfg"}, {"audio": 0, "start": 2295954, "crunched": 0, "end": 2296377, "filename": "/packages/gk/fantasy/stone_ground_gk_v01/package.cfg"}, {"audio": 0, "start": 2296377, "crunched": 0, "end": 2297079, "filename": "/packages/gk/fantasy/iron_plates_gk_v01/package.cfg"}, {"audio": 0, "start": 2297079, "crunched": 0, "end": 2297877, "filename": "/packages/gk/fantasy/wooden_roof_tiles_gk_v01/package.cfg"}, {"audio": 0, "start": 2297877, "crunched": 0, "end": 2298316, "filename": "/packages/gk/fantasy/rock_formation_gk_v02/package.cfg"}, {"audio": 0, "start": 2298316, "crunched": 1, "end": 2416938, "filename": "/packages/gk/fantasy/rock_formation_gk_v01/rock_formation_gk_v01_cc.dds"}, {"audio": 0, "start": 2416938, "crunched": 1, "end": 2435795, "filename": "/packages/gk/fantasy/rock_formation_gk_v01/rock_formation_gk_v01_nm.dds"}, {"audio": 0, "start": 2435795, "crunched": 1, "end": 2466726, "filename": "/packages/gk/fantasy/castell_wall_gk_v01/castell_wall_gk_v01_cc.dds"}, {"audio": 0, "start": 2466726, "crunched": 1, "end": 2497104, "filename": "/packages/gk/fantasy/castell_wall_gk_v01/castell_wall_gk_v01_nm.dds"}, {"audio": 0, "start": 2497104, "crunched": 1, "end": 2527476, "filename": "/packages/gk/fantasy/castell_wall_gk_v02/castell_wall_gk_v02_cc.dds"}, {"audio": 0, "start": 2527476, "crunched": 1, "end": 2546110, "filename": "/packages/gk/fantasy/castell_wall_gk_v02/castell_wall_gk_v02_nm.dds"}, {"audio": 0, "start": 2546110, "crunched": 1, "end": 2560954, "filename": "/packages/gk/fantasy/castell_wall_trim_gk_v01/castell_wall_trim_gk_v01_cc.dds"}, {"audio": 0, "start": 2560954, "crunched": 1, "end": 2575085, "filename": "/packages/gk/fantasy/castell_wall_trim_gk_v01/castell_wall_trim_gk_v01_nm.dds"}, {"audio": 0, "start": 2575085, "crunched": 1, "end": 2694191, "filename": "/packages/gk/fantasy/stone_ground_tiles_gk_v01/stone_ground_tiles_gk_v01_cc.dds"}, {"audio": 0, "start": 2694191, "crunched": 1, "end": 2725290, "filename": "/packages/gk/fantasy/stone_ground_tiles_gk_v01/stone_ground_tiles_gk_v01_nm.dds"}, {"audio": 0, "start": 2725290, "crunched": 1, "end": 2754157, "filename": "/packages/gk/fantasy/wooden_planks_gk_v01/wooden_planks_gk_v01_cc.dds"}, {"audio": 0, "start": 2754157, "crunched": 1, "end": 2782478, "filename": "/packages/gk/fantasy/wooden_planks_gk_v01/wooden_planks_gk_v01_nm.dds"}, {"audio": 0, "start": 2782478, "crunched": 1, "end": 2813355, "filename": "/packages/gk/fantasy/castell_plaster_gk_v01/castell_plaster_gk_v01_cc.dds"}, {"audio": 0, "start": 2813355, "crunched": 1, "end": 2843764, "filename": "/packages/gk/fantasy/castell_plaster_gk_v01/castell_plaster_gk_v01_nm.dds"}, {"audio": 0, "start": 2843764, "crunched": 1, "end": 2908726, "filename": "/packages/gk/fantasy/iron_plates_gk_v01/iron_plates_gk_v01_cc.dds"}, {"audio": 0, "start": 2908726, "crunched": 1, "end": 2973856, "filename": "/packages/gk/fantasy/iron_plates_gk_v01/iron_plates_gk_v01_nm.dds"}, {"audio": 0, "start": 2973856, "crunched": 1, "end": 2988701, "filename": "/packages/gk/fantasy/iron_trim_gk_v01/iron_trim_gk_v01_cc.dds"}, {"audio": 0, "start": 2988701, "crunched": 1, "end": 3003413, "filename": "/packages/gk/fantasy/iron_trim_gk_v01/iron_trim_gk_v01_nm.dds"}, {"audio": 0, "start": 3003413, "crunched": 1, "end": 3010884, "filename": "/packages/gk/fantasy/iron_intersection_gk_v01/iron_intersection_gk_v01_cc.dds"}, {"audio": 0, "start": 3010884, "crunched": 1, "end": 3039742, "filename": "/packages/gk/fantasy/iron_intersection_gk_v01/iron_intersection_gk_v01_nm.dds"}], "remote_package_size": 3039742, "package_uuid": "4b260dc4-cfcf-46b3-ac1a-54ec957ead7c"});

})();

