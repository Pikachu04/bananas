
var Module;

if (typeof Module === 'undefined') Module = eval('(function() { try { return Module || {} } catch(e) { return {} } })()');

if (!Module.expectedDataFileDownloads) {
  Module.expectedDataFileDownloads = 0;
  Module.finishedDataFileDownloads = 0;
}
Module.expectedDataFileDownloads++;
(function() {
 var loadPackage = function(metadata) {

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

          this.finish(byteArray);

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

 }
 loadPackage({"files": [{"audio": 0, "start": 0, "crunched": 0, "end": 4195600, "filename": "/packages/base/two_towers.ogz"}, {"audio": 0, "start": 4195600, "crunched": 0, "end": 4196688, "filename": "/packages/base/two_towers.cfg"}, {"audio": 0, "start": 4196688, "crunched": 0, "end": 4213217, "filename": "/packages/base/two_towers.wpt"}, {"audio": 0, "start": 4213217, "crunched": 0, "end": 4398668, "filename": "/packages/gk/fantasy/skyfantasyJPG/skyfantasy_dn.jpg"}, {"audio": 0, "start": 4398668, "crunched": 0, "end": 4552503, "filename": "/packages/gk/fantasy/skyfantasyJPG/skyfantasy_ft.jpg"}, {"audio": 0, "start": 4552503, "crunched": 0, "end": 4701565, "filename": "/packages/gk/fantasy/skyfantasyJPG/skyfantasy_lf.jpg"}, {"audio": 0, "start": 4701565, "crunched": 0, "end": 4851004, "filename": "/packages/gk/fantasy/skyfantasyJPG/skyfantasy_rt.jpg"}, {"audio": 0, "start": 4851004, "crunched": 0, "end": 5007450, "filename": "/packages/gk/fantasy/skyfantasyJPG/skyfantasy_bk.jpg"}, {"audio": 0, "start": 5007450, "crunched": 0, "end": 5090291, "filename": "/packages/gk/fantasy/skyfantasyJPG/skyfantasy_up.jpg"}, {"audio": 0, "start": 5090291, "crunched": 0, "end": 5090738, "filename": "/packages/gk/fantasy/castell_plaster_gk_v01/package.cfg"}, {"audio": 0, "start": 5090738, "crunched": 0, "end": 5091472, "filename": "/packages/gk/fantasy/wooden_planks_gk_v01/package.cfg"}, {"audio": 0, "start": 5091472, "crunched": 0, "end": 5091896, "filename": "/packages/gk/fantasy/package.cfg"}, {"audio": 0, "start": 5091896, "crunched": 0, "end": 5092695, "filename": "/packages/gk/fantasy/castell_wall_trim_gk_v01/package.cfg"}, {"audio": 0, "start": 5092695, "crunched": 0, "end": 5093134, "filename": "/packages/gk/fantasy/rock_formation_gk_v01/package.cfg"}, {"audio": 0, "start": 5093134, "crunched": 0, "end": 5093853, "filename": "/packages/gk/fantasy/castell_wall_gk_v02/package.cfg"}, {"audio": 0, "start": 5093853, "crunched": 0, "end": 5094312, "filename": "/packages/gk/fantasy/iron_intersection_gk_v01/package.cfg"}, {"audio": 0, "start": 5094312, "crunched": 0, "end": 5095031, "filename": "/packages/gk/fantasy/castell_wall_gk_v01/package.cfg"}, {"audio": 0, "start": 5095031, "crunched": 0, "end": 5095750, "filename": "/packages/gk/fantasy/castell_wall_gk_v03/package.cfg"}, {"audio": 0, "start": 5095750, "crunched": 0, "end": 5096422, "filename": "/packages/gk/fantasy/iron_trim_gk_v01/package.cfg"}, {"audio": 0, "start": 5096422, "crunched": 0, "end": 5096893, "filename": "/packages/gk/fantasy/stone_ground_tiles_gk_v01/package.cfg"}, {"audio": 0, "start": 5096893, "crunched": 0, "end": 5097316, "filename": "/packages/gk/fantasy/stone_ground_gk_v01/package.cfg"}, {"audio": 0, "start": 5097316, "crunched": 0, "end": 5098018, "filename": "/packages/gk/fantasy/iron_plates_gk_v01/package.cfg"}, {"audio": 0, "start": 5098018, "crunched": 0, "end": 5098816, "filename": "/packages/gk/fantasy/wooden_roof_tiles_gk_v01/package.cfg"}, {"audio": 0, "start": 5098816, "crunched": 0, "end": 5099255, "filename": "/packages/gk/fantasy/rock_formation_gk_v02/package.cfg"}, {"audio": 0, "start": 5099255, "crunched": 0, "end": 5448935, "filename": "/packages/gk/fantasy/rock_formation_gk_v01/rock_formation_gk_v01_cc.dds"}, {"audio": 0, "start": 5448935, "crunched": 0, "end": 5536471, "filename": "/packages/gk/fantasy/rock_formation_gk_v01/rock_formation_gk_v01_nm.dds"}, {"audio": 0, "start": 5536471, "crunched": 0, "end": 5886151, "filename": "/packages/gk/fantasy/rock_formation_gk_v02/rock_formation_gk_v02_cc.dds"}, {"audio": 0, "start": 5886151, "crunched": 0, "end": 5973687, "filename": "/packages/gk/fantasy/rock_formation_gk_v02/rock_formation_gk_v02_nm.dds"}, {"audio": 0, "start": 5973687, "crunched": 0, "end": 6061223, "filename": "/packages/gk/fantasy/castell_wall_gk_v01/castell_wall_gk_v01_cc.dds"}, {"audio": 0, "start": 6061223, "crunched": 0, "end": 6148759, "filename": "/packages/gk/fantasy/castell_wall_gk_v01/castell_wall_gk_v01_nm.dds"}, {"audio": 0, "start": 6148759, "crunched": 0, "end": 6236295, "filename": "/packages/gk/fantasy/castell_wall_gk_v02/castell_wall_gk_v02_cc.dds"}, {"audio": 0, "start": 6236295, "crunched": 0, "end": 6323831, "filename": "/packages/gk/fantasy/castell_wall_gk_v02/castell_wall_gk_v02_nm.dds"}, {"audio": 0, "start": 6323831, "crunched": 0, "end": 6367751, "filename": "/packages/gk/fantasy/castell_wall_trim_gk_v01/castell_wall_trim_gk_v01_cc.dds"}, {"audio": 0, "start": 6367751, "crunched": 0, "end": 6411671, "filename": "/packages/gk/fantasy/castell_wall_trim_gk_v01/castell_wall_trim_gk_v01_nm.dds"}, {"audio": 0, "start": 6411671, "crunched": 0, "end": 6761351, "filename": "/packages/gk/fantasy/stone_ground_gk_v01/stone_ground_gk_v01_cc.dds"}, {"audio": 0, "start": 6761351, "crunched": 0, "end": 7111031, "filename": "/packages/gk/fantasy/stone_ground_gk_v01/stone_ground_gk_v01_nm.dds"}, {"audio": 0, "start": 7111031, "crunched": 0, "end": 7460711, "filename": "/packages/gk/fantasy/stone_ground_tiles_gk_v01/stone_ground_tiles_gk_v01_cc.dds"}, {"audio": 0, "start": 7460711, "crunched": 0, "end": 7548247, "filename": "/packages/gk/fantasy/stone_ground_tiles_gk_v01/stone_ground_tiles_gk_v01_nm.dds"}, {"audio": 0, "start": 7548247, "crunched": 0, "end": 7897927, "filename": "/packages/gk/fantasy/wooden_roof_tiles_gk_v01/wooden_roof_tiles_gk_v01_cc.dds"}, {"audio": 0, "start": 7897927, "crunched": 0, "end": 7985463, "filename": "/packages/gk/fantasy/wooden_roof_tiles_gk_v01/wooden_roof_tiles_gk_v01_nm.dds"}, {"audio": 0, "start": 7985463, "crunched": 0, "end": 8072999, "filename": "/packages/gk/fantasy/wooden_planks_gk_v01/wooden_planks_gk_v01_cc.dds"}, {"audio": 0, "start": 8072999, "crunched": 0, "end": 8160535, "filename": "/packages/gk/fantasy/wooden_planks_gk_v01/wooden_planks_gk_v01_nm.dds"}, {"audio": 0, "start": 8160535, "crunched": 0, "end": 8248071, "filename": "/packages/gk/fantasy/castell_plaster_gk_v01/castell_plaster_gk_v01_cc.dds"}, {"audio": 0, "start": 8248071, "crunched": 0, "end": 8335607, "filename": "/packages/gk/fantasy/castell_plaster_gk_v01/castell_plaster_gk_v01_nm.dds"}, {"audio": 0, "start": 8335607, "crunched": 0, "end": 8510535, "filename": "/packages/gk/fantasy/iron_plates_gk_v01/iron_plates_gk_v01_cc.dds"}, {"audio": 0, "start": 8510535, "crunched": 0, "end": 8685463, "filename": "/packages/gk/fantasy/iron_plates_gk_v01/iron_plates_gk_v01_nm.dds"}, {"audio": 0, "start": 8685463, "crunched": 0, "end": 8729383, "filename": "/packages/gk/fantasy/iron_trim_gk_v01/iron_trim_gk_v01_cc.dds"}, {"audio": 0, "start": 8729383, "crunched": 0, "end": 8773303, "filename": "/packages/gk/fantasy/iron_trim_gk_v01/iron_trim_gk_v01_nm.dds"}], "remote_package_size": 8773303, "package_uuid": "cccee9c7-a84a-412f-8346-3151c7b85641"});

})();

