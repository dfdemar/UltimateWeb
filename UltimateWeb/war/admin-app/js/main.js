define('models/team', [
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {
    var Team = Backbone.Model.extend({
        games: null,
        defaults: {
            name: '',
            deleted: false,
            cloudId: '',
            teamId: '',
            season: '',
            nameWithSeason: '',
            private: false,
            password: ''
        }
    });
    return Team;
});
define('restService', [
    'jquery',
    'q'
], function ($, Q) {
    RestService = function (schemeAndHost) {
        var self = this;
        var baseRestUrl = schemeAndHost + '/rest/view';
        var sessionId = new Date().getTime() + '';
        var busyDialogStack = 0;
        this.accessToken = 'unknown';
        this.promiseRetrieveTeamsIncludingDeleted = function () {
            sendAnalyticsEvent('retrieveTeams');
            var url = baseRestUrl + '/teams?includeDeleted=true';
            var promise = new Q.Promise(function (resolve, reject) {
                sendRequest({
                    url: url,
                    dataType: 'json',
                    success: resolve,
                    error: reject
                });
            });
            return promise;
        };
        this.promiseRetrieveTeamForAdmin = function (id, includePlayers, includeInactive) {
            sendAnalyticsEvent('retrieveTeamForAdmin');
            var url = baseRestUrl + '/admin/team/' + id;
            if (includePlayers) {
                url = url + '?players=true';
                if (includeInactive) {
                    url = url + '&includeInactive=true';
                }
            }
            var promise = new Q.Promise(function (resolve, reject) {
                sendRequest({
                    url: url,
                    dataType: 'json',
                    success: resolve,
                    error: reject
                });
            });
            return promise;
        };
        this.promiseRetrieveGamesForAdmin = function (teamId) {
            sendAnalyticsEvent('retrieveGamesForAdmin');
            var url = baseRestUrl + '/admin/team/' + teamId + '/games';
            var promise = new Q.Promise(function (resolve, reject) {
                sendRequest({
                    url: url,
                    dataType: 'json',
                    success: resolve,
                    error: reject
                });
            });
            return promise;
        };
        this.promiseRetrieveGameVersions = function (teamId, gameId) {
            sendAnalyticsEvent('retrieveGameVersions');
            var url = baseRestUrl + '/team/' + teamId + '/game/' + gameId + '/versions';
            var promise = new Q.Promise(function (resolve, reject) {
                sendRequest({
                    url: url,
                    dataType: 'json',
                    success: resolve,
                    error: reject
                });
            });
            return promise;
        };
        this.promiseDeleteGame = function (teamId, gameId) {
            sendAnalyticsEvent('deleteGame');
            var url = baseRestUrl + '/team/' + teamId + '/game/' + gameId + '/delete';
            var promise = new Q.Promise(function (resolve, reject) {
                sendRequest({
                    url: url,
                    dataType: null,
                    isPost: true,
                    success: resolve,
                    error: reject
                });
            });
            return promise;
        };
        this.promiseUndeleteGame = function (teamId, gameId) {
            sendAnalyticsEvent('undeleteGame');
            var url = baseRestUrl + '/team/' + teamId + '/game/' + gameId + '/undelete';
            var promise = new Q.Promise(function (resolve, reject) {
                sendRequest({
                    url: url,
                    dataType: null,
                    isPost: true,
                    success: resolve,
                    error: reject
                });
            });
            return promise;
        };
        this.promiseDeleteTeam = function (teamId) {
            sendAnalyticsEvent('deleteTeam');
            var url = baseRestUrl + '/team/' + teamId + '/delete';
            var promise = new Q.Promise(function (resolve, reject) {
                sendRequest({
                    url: url,
                    dataType: null,
                    isPost: true,
                    success: resolve,
                    error: reject
                });
            });
            return promise;
        };
        this.promiseUndeleteTeam = function (teamId) {
            sendAnalyticsEvent('undeleteTeam');
            var url = baseRestUrl + '/team/' + teamId + '/undelete';
            var promise = new Q.Promise(function (resolve, reject) {
                sendRequest({
                    url: url,
                    dataType: null,
                    isPost: true,
                    success: resolve,
                    error: reject
                });
            });
            return promise;
        };
        this.promiseDeletePlayer = function (teamId, playerToDelete, replacementPlayer) {
            sendAnalyticsEvent('deletePlayer');
            var url = baseRestUrl + '/team/' + teamId + '/player/delete?player=' + playerToDelete + '&replacement=' + replacementPlayer;
            var promise = new Q.Promise(function (resolve, reject) {
                sendRequest({
                    url: url,
                    dataType: null,
                    isPost: true,
                    success: resolve,
                    error: reject
                });
            });
            return promise;
        };
        this.promiseRenamePlayer = function (teamId, playerToRename, replacementPlayer, firstName, lastName) {
            sendAnalyticsEvent('renamePlayer');
            var url = baseRestUrl + '/team/' + teamId + '/player/rename?player=' + playerToRename + '&replacement=' + replacementPlayer + '&firstName=' + firstName + '&lastName=' + lastName;
            var promise = new Q.Promise(function (resolve, reject) {
                sendRequest({
                    url: url,
                    dataType: null,
                    isPost: true,
                    success: resolve,
                    error: reject
                });
            });
            return promise;
        };
        this.promiseRestoreGameVersion = function (teamId, gameId, versionId) {
            sendAnalyticsEvent('restoreGameVersion');
            var url = baseRestUrl + '/team/' + teamId + '/game/' + gameId + '/version/' + versionId + '/restore';
            var promise = new Q.Promise(function (resolve, reject) {
                sendRequest({
                    url: url,
                    dataType: null,
                    isPost: true,
                    success: resolve,
                    error: reject
                });
            });
            return promise;
        };
        this.promiseImportGame = function (teamId, gameFormData) {
            sendAnalyticsEvent('importGame');
            var url = baseRestUrl + '/team/' + teamId + '/import2/game';
            var promise = new Q.Promise(function (resolve, reject) {
                sendRequest({
                    url: url,
                    data: gameFormData,
                    isFileUpload: true,
                    success: resolve,
                    error: reject
                });
            });
            return promise;
        };
        this.promiseSavePassword = function (teamId, password) {
            sendAnalyticsEvent('savePassword');
            var url = baseRestUrl + '/team/' + teamId + '/password/' + (isNullOrEmpty(password) ? 'REMOVE-PASSWORD' : password);
            var promise = new Q.Promise(function (resolve, reject) {
                sendRequest({
                    url: url,
                    dataType: null,
                    isPost: true,
                    success: resolve,
                    error: reject
                });
            });
            return promise;
        };
        this.urlForGameExportFileDownload = function (teamId, gameId) {
            var url = baseRestUrl + '/team/' + teamId + '/export/game/' + gameId + '?players=true&access_token=' + this.accessToken;
            return url;
        };
        function sendRequest(request) {
            var options = {
                success: function (data, textStatus, jqXHR) {
                    busyDialogEnd();
                    var responseTypeReceived = jqXHR.getResponseHeader('Content-Type');
                    if (isExpectedResponseType(request, jqXHR)) {
                        request.success(data, textStatus, jqXHR);
                    } else {
                        logRequestFailure(jqXHR, '', 'unexpected response type = ' + responseTypeReceived);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    busyDialogEnd();
                    var error = logRequestFailure(jqXHR, textStatus, errorThrown);
                    if (request.error) {
                        request.error(jqXHR, textStatus, errorThrown);
                    } else {
                        throw error;
                    }
                }
            };
            if (request.dataType) {
                options.dataType = request.dataType;
            }
            if (request.isFileUpload) {
                options.processData = false;
                options.contentType = false;
                options.enctype = 'multipart/form-data';
                options.type = 'POST';
            } else if (request.isPost) {
                options.type = 'POST';
                options.contentType = 'application/json';
            }
            if (request.data) {
                options.data = request.data;
            }
            options.xhrFields = { withCredentials: true };
            options.headers = { 'Authorization': 'Bearer ' + self.accessToken };
            busyDialogStart();
            if (options.type != 'GET') {
                resetCacheBuster();
            }
            var url = addQueryStringParameter(request.url, 'cachebuster', sessionId);
            $.ajax(url, options);
        }
        function isExpectedResponseType(request, responseTypeReceived) {
            if (request.expectedResponseType) {
                if (responseTypeReceived.indexOf(request.expectedResponseType) < 0) {
                    return false;
                }
            }
            return true;
        }
        function logRequestFailure(jqXHR, textStatus, errorThrow) {
            var error = errorDescription(jqXHR, textStatus, errorThrow);
            logError(error);
            return error;
        }
        function errorDescription(jqXHR, textStatus, errorThrow) {
            return 'ERROR: status ' + jqXHR.status + ' (' + textStatus + ') ' + errorThrow + (jqXHR.responseText ? ' \n' + jqXHR.responseText : '');
        }
        function logError(error) {
            if (window.console) {
                console.log(error);
            }
        }
        function sortGames(games) {
            var sortedGames = games.sort(function (a, b) {
                var first = a.msSinceEpoch ? a.msSinceEpoch : 0;
                var second = b.msSinceEpoch ? b.msSinceEpoch : 0;
                return second - first;
            });
            return sortedGames;
        }
        function collectGameIds(games) {
            var gameIds = [];
            $.each(games, function () {
                gameIds.push(this.gameId);
            });
            return gameIds;
        }
        function log(message) {
            if (window.console) {
                console.log(message);
            }
        }
        function isNullOrEmpty(s) {
            return s == null || jQuery.trim(s) == '';
        }
        function busyDialogStart() {
            busyDialogStack++;
            if (busyDialogStack == 1) {
                $('.hideWhenBusy').addClass('hidden');
                $('.spinner').removeClass('hidden');
            }
        }
        function busyDialogEnd() {
            busyDialogStack--;
            if (busyDialogStack == 0) {
                resetBusyDialog();
            }
        }
        function resetBusyDialog() {
            $('.spinner').addClass('hidden');
            showHiddenWhenBusyElements();
            busyDialogStack == 0;
        }
        function showHiddenWhenBusyElements() {
            $('.hideWhenBusy').removeClass('hidden');
        }
        function hideHiddenWhenBusyElements() {
            $('.hideWhenBusy').addClass('hidden');
        }
        function addQueryStringParameter(url, key, value) {
            return url + (url.indexOf('?') > 0 ? '&' : '?') + key + '=' + value;
        }
        function resetCacheBuster() {
            sessionId = new Date().getTime() + '';
        }
        function sendAnalyticsEvent(restEndpointName) {
        }
    };
    if (window.location.href.indexOf('local-services=true') > -1) {
        return new RestService('http://' + document.location.hostname + ':' + document.location.port);
    } else {
        return new RestService('http://www.ultianalytics.com');
    }
});
define('collections/teams', [
    'jquery',
    'underscore',
    'backbone',
    'models/team',
    'restService'
], function ($, _, Backbone, Team, restService) {
    var TeamCollection = Backbone.Collection.extend({
        model: Team,
        selectedTeam: null,
        isEmpty: function () {
            return this.models.length == 0;
        },
        populateFromRestResponse: function (restDataArray) {
            var teams = [];
            for (var i = 0; i < restDataArray.length; i++) {
                teams.push(new Team(restDataArray[i]));
            }
            var appContext = require('appContext');
            appContext.selectDefaultTeam(teams);
            this.reset(teams);
        },
        teamWithCloudId: function (cloudId) {
            return this.findWhere({ cloudId: cloudId });
        },
        ensureFetched: function (success, failure) {
            var collection = this;
            if (this.isEmpty()) {
                restService.promiseRetrieveTeamsIncludingDeleted().then(function (teams) {
                    collection.populateFromRestResponse(teams);
                    success();
                }, function () {
                    failure();
                });
            } else {
                success();
            }
        }
    });
    return new TeamCollection();
});
define('appContext', [
    'jquery',
    'underscore',
    'backbone',
    'collections/teams'
], function ($, _, Backbone, teamCollection) {
    var AppContext = Backbone.Model.extend({
        defaults: {
            currentUser: null,
            currentTeam: null,
            currentTab: 'settings'
        },
        initialize: function () {
        },
        selectDefaultTeam: function (teamModels) {
            var teams = teamModels == null ? teamCollection.models : teamModels;
            var defaultTeam = teams.length == 0 ? null : teams[0];
            for (var i = 0; i < teams.length; i++) {
                if (!teams[i].get('deleted')) {
                    defaultTeam = teams[i];
                    break;
                }
            }
            if (defaultTeam != null) {
                if (this.currentTeamId() != defaultTeam.get('cloudId')) {
                    this.set('currentTeam', defaultTeam);
                }
            }
        },
        refreshTeams: function (success, failure) {
            teamCollection.reset();
            var selectedTeam = this.currentTeam();
            var selectedTab = this.currentTab();
            var context = this;
            teamCollection.ensureFetched(function () {
                if (!teamCollection.isEmpty()) {
                    if (selectedTeam) {
                        var refreshedSelectedTeam = teamCollection.teamWithCloudId(selectedTeam.get('cloudId'));
                        context.set('currentTeam', refreshedSelectedTeam);
                        if (selectedTab) {
                            context.set('currentTab', selectedTab);
                        }
                    }
                }
            }, failure);
        },
        currentUser: function () {
            return this.get('currentUser');
        },
        hasCurrentUser: function () {
            return this.currentUser() != null;
        },
        currentUserEmail: function () {
            return this.hasCurrentUser() ? this.currentUser().get('email') : '';
        },
        currentTeam: function () {
            return this.get('currentTeam');
        },
        currentTeamId: function () {
            var currTeam = this.currentTeam();
            return currTeam == null ? null : currTeam.get('cloudId');
        },
        currentTab: function () {
            return this.get('currentTab');
        }
    });
    return new AppContext();
});
define('models/game', [
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {
    var Game = Backbone.Model.extend({
        defaults: {
            'gameId': '',
            'opponentName': '',
            'timestamp': '',
            'date': '',
            'time': '',
            'ours': 18,
            'theirs': 13,
            'previousVersionAvailable': false,
            'msSinceEpoch': 0,
            'deleted': false
        }
    });
    return Game;
});
define('collections/games', [
    'jquery',
    'underscore',
    'backbone',
    'models/game'
], function ($, _, Backbone, Game) {
    var GameCollection = Backbone.Collection.extend({
        model: Game,
        populateFromRestResponse: function (restDataArray) {
            var games = [];
            for (var i = 0; i < restDataArray.length; i++) {
                games.push(new Game(restDataArray[i]));
            }
            this.reset(games);
        },
        gameWithGameId: function (gameId) {
            return this.findWhere({ gameId: gameId });
        },
        sortedGames: function () {
            var sortedGames = this.models.sort(function (a, b) {
                var first = a.get('msSinceEpoch') ? a.get('msSinceEpoch') : 0;
                var second = b.get('msSinceEpoch') ? b.get('msSinceEpoch') : 0;
                return second - first;
            });
            return sortedGames;
        }
    });
    return new GameCollection();
});
define('models/player', [
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {
    var Player = Backbone.Model.extend({
        defaults: {
            'name': '',
            'lastName': '',
            'firstName': '',
            'number': '',
            'position': '',
            'inactive': false,
            'male': true,
            'absent': false
        }
    });
    return Player;
});
define('collections/players', [
    'jquery',
    'underscore',
    'backbone',
    'models/player'
], function ($, _, Backbone, Player) {
    var PlayerCollection = Backbone.Collection.extend({
        model: Player,
        populateFromRestResponse: function (restDataArray) {
            var players = [];
            for (var i = 0; i < restDataArray.length; i++) {
                players.push(new Player(restDataArray[i]));
            }
            this.reset(players);
        },
        playerWithName: function (name) {
            if (name.toLowerCase() == 'anonymous') {
                return this.anonymousPlayer();
            }
            return this.findWhere({ name: name });
        },
        playersIncludingAnonymousButExcluding: function (playerNameToExclude) {
            var players = _.filter(this.models, function (player) {
                return player.get('name') != playerNameToExclude && player.get('name').toLowerCase() != 'anonymous';
            });
            players.splice(0, 0, this.anonymousPlayer());
            return players;
        },
        anonymousPlayer: function () {
            return new Player({ name: 'Anonymous' });
        }
    });
    return new PlayerCollection();
});
define('templates/teamSelector.html', [], function () {
    return '<div class="dropdown">\n    <button class="btn btn-default dropdown-toggle<%= selectedTeam.toJSON().deleted ? \' strike-through\' : \'\'%>" type="button" data-toggle="dropdown"><%= _.escape(selectedTeam.get(\'nameWithSeason\')) %>&nbsp;&nbsp;&nbsp;\n        <span class="caret"></span></button>\n    <ul class="dropdown-menu">\n        <% _.each(teams, function(team) { %>\n        <li class= "<%= team.get(\'deleted\') ? \'strike-through\' : \'\'%>"><a href="#" ulti-team-choice="<%= team.get(\'cloudId\') %>"><%= _.escape(team.get(\'nameWithSeason\')) %></a></li>\n        <% }); %>\n    </ul>\n</div>';
});
define('views/TeamSelectorView', [
    'jquery',
    'underscore',
    'backbone',
    'collections/teams',
    'appContext',
    'templates/teamSelector.html'
], function ($, _, Backbone, teamCollection, appContext, teamSelectorHtml) {
    var TeamSelectorView = Backbone.View.extend({
        el: '[ulti-team-selector]',
        initialize: function () {
            teamCollection.on('reset', this.teamsChanged, this);
            appContext.on('change:currentTeam', this.selectedTeamChanged, this);
        },
        template: _.template(teamSelectorHtml),
        teamsChanged: function () {
            if (!teamCollection.isEmpty()) {
                this.render();
            }
        },
        selectedTeamChanged: function () {
            this.render();
        },
        render: function () {
            this.$el.html(this.template({
                teams: teamCollection.models,
                selectedTeam: appContext.currentTeam()
            }));
            this.$('[ulti-team-choice]').click(function (e) {
                e.preventDefault();
                var selectedCloudId = e.currentTarget.attributes['ulti-team-choice'].value;
                var router = require('router');
                router.navigate('team/' + selectedCloudId + '/settings', { trigger: true });
            });
            return this;
        }
    });
    return TeamSelectorView;
});
define('views/TeamStatsBasicInfoView', [
    'jquery',
    'underscore',
    'backbone',
    'appContext'
], function ($, _, Backbone, appContext) {
    var TeamStatsBasicInfoView = Backbone.View.extend({
        el: '[ulti-team-basic-info]',
        initialize: function () {
            appContext.on('change:currentTeam', this.render, this);
        },
        render: function () {
            var currentTeam = appContext.currentTeam();
            var cloudId = currentTeam.get('cloudId');
            this.$('[ulti-team-cloudid]').html(cloudId);
            var url = 'http://www.ultianalytics.com/app/#/' + cloudId + '/players';
            this.$('[ulti-stats-site-link]').attr('href', url);
            this.$('[ulti-stats-site-link]').toggleClass('hidden', currentTeam.get('deleted'));
            return this;
        }
    });
    return TeamStatsBasicInfoView;
});
define('views/TabView', [
    'jquery',
    'underscore',
    'backbone',
    'appContext'
], function ($, _, Backbone, appContext) {
    var TabView = Backbone.View.extend({
        el: '[ulti-tab]',
        events: { 'click a': 'tabPicked' },
        initialize: function () {
            appContext.on('change:currentTeam', this.teamChanged, this);
            appContext.on('change:currentTab', this.tabChanged, this);
        },
        teamChanged: function () {
            appContext.set('currentTab', 'settings');
            this.render();
        },
        tabChanged: function () {
            this.render();
        },
        render: function () {
            this.$('li [ulti-tab-choice="settings"]').parent().toggleClass('active', appContext.currentTab() == 'settings');
            this.$('li [ulti-tab-choice="games"]').parent().toggleClass('active', appContext.currentTab() == 'games');
            this.$('li [ulti-tab-choice="players"]').parent().toggleClass('active', appContext.currentTab() == 'players');
            this.$el.toggleClass('hidden', appContext.currentTeam().get('deleted'));
            return this;
        },
        tabPicked: function (e) {
            e.preventDefault();
            var selectedTab = e.currentTarget.attributes['ulti-tab-choice'].value;
            var router = require('router');
            router.navigate('team/' + appContext.currentTeamId() + '/' + selectedTab, { trigger: true });
        }
    });
    return TabView;
});
define('templates/modal.html', [], function () {
    return '<div class="modal-content">\n    <div class="modal-header">\n        <button type="button" class="close" data-dismiss="modal">&times;</button>\n        <h4 class="modal-title" style="color: white"><%= title %></h4>\n    </div>\n    <div ulti-dialog-view-content/>\n</div>';
});
define('views/UltiView', [
    'jquery',
    'underscore',
    'backbone',
    'bootbox'
], function ($, _, Backbone, bootbox) {
    var UltiView = Backbone.View.extend({
        showServerErrorDialog: function () {
            this.showErrorDialog('Server Error', 'Ouch...we experienced an error trying to talk to our server.<br/><br/>Please try again by refreshing your browser.<br/><br/>If the problem persists, please notify us at <a href="mailto:support@ultianalytics.com">support@ultianalytics.com</a>.');
        },
        showErrorDialog: function (title, message) {
            bootbox.alert({
                size: 'small',
                title: title,
                message: message
            });
        }
    });
    return UltiView;
});
define('views/AbstractDetailContentsView', [
    'jquery',
    'underscore',
    'backbone',
    'templates/modal.html',
    'views/UltiView'
], function ($, _, Backbone, modalHtml, UltiView) {
    var AbstractDetailContentsView = UltiView.extend({
        modalTemplate: _.template(modalHtml),
        showModalDialog: function (title, contentViewCreator) {
            $('[ulti-dialog-content]').html(this.modalTemplate({ title: title }));
            var contentView = contentViewCreator();
            contentView.render();
            $('#ulti-dialog').modal('show');
        },
        dismissModalDialog: function () {
            $('#ulti-dialog').modal('hide');
        }
    });
    return AbstractDetailContentsView;
});
define('utility', ['jquery'], function ($) {
    isEmpty = function (string) {
        return string == null || $.trim(string).length == 0;
    };
    return {
        noArgsNoReturnFunction: function () {
        }
    };
});
define('views/DialogView', [
    'jquery',
    'underscore',
    'backbone',
    'views/UltiView'
], function ($, _, Backbone, UltiView) {
    var DialogView = UltiView.extend({
        el: '[ulti-dialog-view-content]',
        initialize: function () {
        },
        dismiss: function () {
            $('#ulti-dialog').modal('hide');
        }
    });
    return DialogView;
});
define('templates/teamPasswordDialogContent.html', [], function () {
    return '<div class="modal-body">\n    <input type="text" class="form-control" placeholder="New Password" ulti-password-text value="<%= team.get(\'password\') %>"/>\n</div>\n<div class="modal-footer" style="text-align: center">\n    <button type="button" class="btn btn-primary" ulti-password-button-save>Save</button>\n    <button type="button" class="btn btn-primary" ulti-password-button-remove>Remove</button>\n    <button type="button" class="btn btn-primary" ulti-password-button-cancel>Cancel</button>\n</div>';
});
define('views/PasswordDialogView', [
    'jquery',
    'underscore',
    'backbone',
    'utility',
    'views/DialogView',
    'appContext',
    'restService',
    'templates/teamPasswordDialogContent.html'
], function ($, _, Backbone, utility, DialogView, appContext, restService, teamPasswordDialogContentHtml) {
    var PasswordDialogView = DialogView.extend({
        passwordChanged: utility.noArgsNoReturnFunction,
        template: _.template(teamPasswordDialogContentHtml),
        render: function () {
            this.$el.html(this.template({ team: appContext.currentTeam() }));
            this.updateSaveButtonEnablement();
        },
        events: {
            'click [ulti-password-button-save]': 'savePasswordTapped',
            'click [ulti-password-button-remove]': 'removePasswordTapped',
            'click [ulti-password-button-cancel]': 'cancelPasswordTapped',
            'input [ulti-password-text]': 'updateSaveButtonEnablement'
        },
        savePasswordTapped: function () {
            this.updatePassword(this.getPassword());
        },
        removePasswordTapped: function () {
            this.updatePassword('');
        },
        cancelPasswordTapped: function () {
            this.dismiss();
        },
        updateSaveButtonEnablement: function () {
            var isValidPassword = this.getPassword().length > 0;
            this.$('[ulti-password-button-save]').prop('disabled', !isValidPassword);
        },
        getPassword: function () {
            return $.trim($('[ulti-password-text]').val());
        },
        updatePassword: function (password) {
            var view = this;
            restService.promiseSavePassword(appContext.currentTeamId(), password).then(function () {
                if (view.passwordChanged) {
                    view.passwordChanged();
                }
                view.dismiss();
            }, function () {
                view.showServerErrorDialog();
            });
        }
    });
    return PasswordDialogView;
});
define('templates/teamSettings.html', [], function () {
    return '<div>\n    <b>Team Website Password:&nbsp;&nbsp; </b><button class="borderless-button" ulti-team-password-link><%= team == null || team.password == "" ? "NOT SET" : _.escape(team.password) %></button>\n    <br>\n    <span style="font-size: smaller;color: #ababab">(visitors to your site will be asked to enter this password to view this team\'s statistics)</span>\n</div>\n<div style="margin-top: 20px">\n    <button class="btn btn-delete" style="margin-top: 30px" ulti-team-delete-button>Delete Team</button>\n</div>';
});
define('templates/teamDeletedSettings.html', [], function () {
    return 'This team has been deleted.  Click <b>Un-delete</b> to restore the team and the associated games/players.\n<div style="margin-top: 30px;text-align: center">\n    <button class="btn btn-undelete" style="margin-top: 30px" ulti-team-undelete-button>Un-Delete Team</button>\n</div>\n';
});
define('views/SettingView', [
    'jquery',
    'underscore',
    'backbone',
    'collections/teams',
    'views/AbstractDetailContentsView',
    'views/PasswordDialogView',
    'appContext',
    'bootbox',
    'restService',
    'templates/teamSettings.html',
    'templates/teamDeletedSettings.html'
], function ($, _, Backbone, teamCollection, AbstractDetailContentsView, PasswordDialogView, appContext, bootbox, restService, teamSettingsHtml, teamDeletedSettingsHtml) {
    var SettingView = AbstractDetailContentsView.extend({
        el: '[ulti-team-detail-settings]',
        initialize: function () {
        },
        events: {
            'click [ulti-team-password-link]': 'passwordTapped',
            'click [ulti-team-delete-button]': 'deleteTapped',
            'click [ulti-team-undelete-button]': 'undeleteTapped'
        },
        template: _.template(teamSettingsHtml),
        deletedTeamTemplate: _.template(teamDeletedSettingsHtml),
        render: function () {
            var currentTeam = appContext.currentTeam();
            if (currentTeam.get('deleted')) {
                this.$el.html(this.deletedTeamTemplate());
            } else {
                this.$el.html(this.template({ team: currentTeam == null ? {} : currentTeam.toJSON() }));
            }
        },
        passwordTapped: function () {
            this.showPasswordChangeDialog();
        },
        deleteTapped: function () {
            var view = this;
            bootbox.confirm({
                size: 'small',
                title: 'Confirm Delete',
                message: 'Do you really want to delete ' + appContext.currentTeam().get('nameWithSeason') + ' (team ID ' + appContext.currentTeamId() + ')?<br/><br/>NOTE: you can un-delete the team later',
                callback: function (result) {
                    if (result == true) {
                        restService.promiseDeleteTeam(appContext.currentTeamId()).then(function () {
                            appContext.refreshTeams(function () {
                            }, function () {
                                view.showServerErrorDialog();
                            });
                        }, function () {
                            view.showServerErrorDialog();
                        });
                    }
                }
            });
        },
        undeleteTapped: function () {
            var view = this;
            restService.promiseUndeleteTeam(appContext.currentTeamId()).then(function () {
                appContext.refreshTeams(function () {
                }, function () {
                    view.showServerErrorDialog();
                });
            }, function () {
                view.showServerErrorDialog();
            });
        },
        showPasswordChangeDialog: function () {
            var view = this;
            this.showModalDialog('Set Team Password', function () {
                var passwordDialog = new PasswordDialogView();
                passwordDialog.passwordChanged = function () {
                    appContext.refreshTeams(function () {
                        this.render();
                    }, function () {
                        view.showServerErrorDialog();
                    });
                };
                return passwordDialog;
            });
        }
    });
    return SettingView;
});
define('models/gameVersion', [
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {
    var GameVersion = Backbone.Model.extend({
        defaults: {
            'keyIdentifier': '',
            'description': '',
            'updateUtc': '',
            'ourScore': '',
            'theirScore': '',
            'currentVersion': false
        },
        fullDescription: function () {
            return this.get('updateUtc') + ' GMT, score: ' + this.get('ourScore') + '-' + this.get('theirScore') + ', ' + this.get('description');
        }
    });
    return GameVersion;
});
define('collections/gameVersions', [
    'jquery',
    'underscore',
    'backbone',
    'models/gameVersion',
    'appContext',
    'restService'
], function ($, _, Backbone, GameVersion, appContext, restService) {
    var GameVersionCollection = Backbone.Collection.extend({
        game: null,
        model: GameVersion,
        populateFromRestResponse: function (restDataArray) {
            var gameVersions = [];
            for (var i = 0; i < restDataArray.length; i++) {
                gameVersions.push(new GameVersion(restDataArray[i]));
            }
            this.reset(gameVersions);
        },
        currentVersion: function () {
            return this.findWhere({ currentVersion: true });
        },
        nonCurrentVersions: function () {
            return this.where({ currentVersion: false });
        },
        hasMultipleVersions: function () {
            return this.nonCurrentVersions().length > 0;
        },
        gameVersionWithKey: function (versionKey) {
            return this.findWhere({ keyIdentifier: versionKey });
        },
        refreshForGame: function (game, success, failure) {
            this.game = game;
            var collection = this;
            restService.promiseRetrieveGameVersions(appContext.currentTeamId(), game.get('gameId')).then(function (gameVersions) {
                collection.populateFromRestResponse(gameVersions);
                success();
            }, function () {
                failure();
            });
        }
    });
    return new GameVersionCollection();
});
define('templates/gameImportDialogContent.html', [], function () {
    return '  <form method="post" ulti-game-import-form>\n      <div class="modal-body">\n          Browse to the game export file (.iexport file extension) on your computer and then press <b>Import</b>.\n          <br/><br/>\n          <span class="file-input btn btn-primary btn-file">\n              Browse to file...<input type="file" ulti-import-select-file-input>\n          </span><br/><br/>\n          <span ulti-import-selected-file></span>\n      </div>\n      <div class="modal-footer" style="text-align: center">\n          <input type="button" class="btn btn-primary" value="Import" ulti-import-button-import>\n          <button type="button" class="btn btn-primary" ulti-import-button-cancel>Cancel</button>\n      </div>\n  </form>';
});
define('views/GameImportDialogView', [
    'jquery',
    'underscore',
    'backbone',
    'utility',
    'views/DialogView',
    'appContext',
    'restService',
    'templates/gameImportDialogContent.html'
], function ($, _, utility, Backbone, DialogView, appContext, restService, gameImportDialogContentHtml) {
    var GameImportDialogView = DialogView.extend({
        importComplete: utility.noArgsNoReturnFunction,
        template: _.template(gameImportDialogContentHtml),
        render: function () {
            this.$el.html(this.template());
            this.updateImportButtonEnablement();
        },
        events: {
            'click [ulti-import-button-import]': 'importTapped',
            'click [ulti-import-button-cancel]': 'cancelTapped',
            'change [ulti-import-select-file-input]': 'fileSelected'
        },
        importTapped: function () {
            var file = this.$('[ulti-import-select-file-input]').get(0).files[0];
            var formData = new FormData();
            formData.append('file', file);
            var view = this;
            restService.promiseImportGame(appContext.currentTeamId(), formData).then(function (data) {
                if (data && data.status == 'error') {
                    var explanation = data.message;
                    alert('import failed: ' + explanation);
                } else {
                    view.importComplete();
                    view.dismiss();
                }
            }, function () {
                view.showServerErrorDialog();
            });
        },
        cancelTapped: function () {
            this.dismiss();
        },
        fileSelected: function (e, numFiles, fileName) {
            this.$('[ulti-import-selected-file]').html(this.fileNameSelected());
            this.updateImportButtonEnablement();
        },
        updateImportButtonEnablement: function () {
            var isReadyForImport = !isEmpty(this.$('[ulti-import-selected-file]').html());
            this.$('[ulti-import-button-import]').prop('disabled', !isReadyForImport);
        },
        fileElement: function () {
            return this.$('[ulti-import-select-file-input]');
        },
        fileNameSelected: function () {
            var fileElement = this.fileElement();
            var numFiles = fileElement.get(0).files ? fileElement.get(0).files.length : 1;
            var fileName = fileElement.val().replace(/\\/g, '/').replace(/.*\//, '');
            return fileName;
        }
    });
    return GameImportDialogView;
});
define('templates/gameVersionsDialogContent.html', [], function () {
    return '<div class="modal-body">\n    <div>You can replace this game&apos;s data with a version previously stored.  To replace this game, pick a version from the list and click the Replace button.</div>\n    <br>\n    <div>NOTE: You will not lose the current version of this game if you replace it.  To undo your action simply replace the version with the original you replaced.</div>\n    <br>\n    <div>Current Version: <br>\n        <span><b><%= currentGameVersion == null? \'?\' : currentGameVersion.fullDescription() %></b></span>\n    </div>\n    <br>\n    <div class="dropdown">\n        <button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown"><%= selectedGameVersion.fullDescription() %>&nbsp;&nbsp;&nbsp;\n            <span class="caret"></span>\n        </button>\n        <ul class="dropdown-menu">\n            <% _.each(nonCurrentGameVersions, function(gameVersion) { %>\n            <li><a href="#" ulti-game-version-choice="<%= gameVersion.get(\'keyIdentifier\') %>"><%= gameVersion.fullDescription() %></a></li>\n            <% }); %>\n        </ul>\n    </div>\n</div>\n<div class="modal-footer" style="text-align: center">\n    <button type="button" class="btn btn-primary" ulti-versions-button-replace>Replace</button>\n    <button type="button" class="btn btn-primary" ulti-versions-button-cancel>Cancel</button>\n</div>';
});
define('views/GameVersionsDialogView', [
    'jquery',
    'underscore',
    'backbone',
    'utility',
    'views/DialogView',
    'appContext',
    'collections/gameVersions',
    'bootbox',
    'restService',
    'templates/gameVersionsDialogContent.html'
], function ($, _, Backbone, utility, DialogView, appContext, gameVersionCollection, bootbox, restService, gameVersionsDialogContentHtml) {
    var GameVersionsDialogView = DialogView.extend({
        game: null,
        replaceComplete: utility.noArgsNoReturnFunction,
        selectedGameVersion: null,
        initialize: function () {
            self = this;
            self.selectedGameVersion = gameVersionCollection.nonCurrentVersions()[0];
        },
        template: _.template(gameVersionsDialogContentHtml),
        render: function () {
            this.$el.html(this.template({
                nonCurrentGameVersions: gameVersionCollection.nonCurrentVersions(),
                selectedGameVersion: self.selectedGameVersion,
                currentGameVersion: gameVersionCollection.currentVersion()
            }));
            this.$('[ulti-game-version-choice]').click(function (e) {
                e.preventDefault();
                var selectedVersionKey = e.currentTarget.attributes['ulti-game-version-choice'].value;
                self.selectedGameVersion = gameVersionCollection.gameVersionWithKey(parseInt(selectedVersionKey));
                self.render();
            });
        },
        events: {
            'click [ulti-versions-button-replace]': 'replaceTapped',
            'click [ulti-versions-button-cancel]': 'cancelTapped'
        },
        replaceTapped: function () {
            restService.promiseRestoreGameVersion(appContext.currentTeamId(), self.game.get('gameId'), self.selectedGameVersion.get('keyIdentifier')).then(function () {
                bootbox.alert({
                    size: 'small',
                    title: 'Update Complete',
                    message: 'The current game version has been replaced with version <b>' + self.selectedGameVersion.fullDescription() + '</b>'
                });
                self.replaceComplete();
                self.dismiss();
            }, function () {
                alert('bad thang happened');
            });
        },
        cancelTapped: function () {
            this.dismiss();
        }
    });
    return GameVersionsDialogView;
});
define('templates/gameList.html', [], function () {
    return '<div class="container">\n    <% _.each(games, function(game) { %>\n    <div class="row" style="margin-bottom: 20px">\n        <div class="col-sm-6 <%= game.deleted ? \'strike-through\' : \'\' %>"><span><%= game.date + \' \' + game.time %></span>\n            <% if ( game.deleted ) { %>\n            <span> vs. <%= game.opponentName %></span>\n            <% } else { %>\n            <span> vs. <a href="http://www.ultianalytics.com/app/#/<%= teamId %>/games?<%= game.gameId %>"><%= game.opponentName %></a></span>\n            <% } %>\n            <span> (<%= game.ours %>-<%= game.theirs %> <%= game.ours > game.theirs ? \'us\' : \'them\' %>)</span></div>\n        <div class="col-sm-6">\n            <button ulti-game-list-button-undelete="<%= game.gameId %>" class="borderless-button <%= game.deleted ? \'\' : \'hidden\' %>" title="un-delete game"><i class="fa fa-undo" style="font-size: large"></i></button>\n            <button ulti-game-list-button-export="<%= game.gameId %>" class="borderless-button <%= game.deleted ? \'hidden\' : \'\' %>" title="export game to your computer">Export</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n            <button ulti-game-list-button-versions="<%= game.gameId %>" class="borderless-button <%= game.deleted ? \'hidden\' : \'\' %>" title="display versions of this game">Versions</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n            <button ulti-game-list-button-delete="<%= game.gameId %>" class="borderless-button <%= game.deleted ? \'hidden\' : \'\' %>" title="delete game"><i class="fa fa-trash-o" style="font-size: large"></i></button>\n        </div>\n    </div>\n    <% }); %>\n</div>\n<div style="margin-top: 20px">\n    <button class="btn btn-primary" style="margin-top: 30px" ulti-game-import-button>Import Game</button>\n</div>\n';
});
define('templates/gameListEmpty.html', [], function () {
    return '<div style="margin-left: 40px">\n    No games for this team\n</div>\n<div style="margin-top: 20px">\n    <button class="btn btn-primary" style="margin-top: 30px" ulti-game-import-button>Import Game</button>\n</div>\n\n';
});
define('views/GamesView', [
    'jquery',
    'underscore',
    'backbone',
    'collections/games',
    'collections/gameVersions',
    'views/AbstractDetailContentsView',
    'views/GameImportDialogView',
    'views/GameVersionsDialogView',
    'appContext',
    'bootbox',
    'restService',
    'templates/gameList.html',
    'templates/gameListEmpty.html'
], function ($, _, Backbone, gameCollection, gameVersionsCollection, AbstractDetailContentsView, GameImportDialogView, GameVersionsDialogView, appContext, bootbox, restService, gameListHtml, gameListEmptyHtml) {
    var GamesView = AbstractDetailContentsView.extend({
        el: '[ulti-team-detail-games]',
        initialize: function () {
            gameCollection.on('reset', this.render, this);
        },
        events: {
            'click [ulti-game-list-button-export]': 'exportTapped',
            'click [ulti-game-list-button-versions]': 'versionsTapped',
            'click [ulti-game-list-button-delete]': 'deleteTapped',
            'click [ulti-game-list-button-undelete]': 'undeleteTapped',
            'click [ulti-game-import-button]': 'importTapped'
        },
        template: _.template(gameListHtml),
        noGamesTemplate: _.template(gameListEmptyHtml),
        render: function () {
            if (gameCollection.isEmpty()) {
                this.$el.html(this.noGamesTemplate());
            } else {
                var games = _.map(gameCollection.sortedGames(), function (game) {
                    return game.toJSON();
                });
                this.$el.html(this.template({
                    games: games,
                    teamId: appContext.currentTeamId()
                }));
            }
        },
        refresh: function () {
            var view = this;
            restService.promiseRetrieveGamesForAdmin(appContext.currentTeamId()).then(function (games) {
                gameCollection.populateFromRestResponse(games);
                view.render();
            }, function () {
                view.showServerErrorDialog();
            });
        },
        exportTapped: function (e) {
            var game = this.gameForButton(e.currentTarget, 'ulti-game-list-button-export');
            var downloadUrl = restService.urlForGameExportFileDownload(appContext.currentTeamId(), game.get('gameId'));
            location.href = downloadUrl;
        },
        versionsTapped: function (e) {
            var game = this.gameForButton(e.currentTarget, 'ulti-game-list-button-versions');
            var view = this;
            gameVersionsCollection.refreshForGame(game, function () {
                if (gameVersionsCollection.hasMultipleVersions()) {
                    view.showGameVersionsDialog(game);
                } else {
                    bootbox.alert({
                        size: 'small',
                        title: 'No Other Versions',
                        message: 'This game does not have previous versions.'
                    });
                }
            }, function () {
                view.showServerErrorDialog();
            });
        },
        deleteTapped: function (e) {
            var game = this.gameForButton(e.currentTarget, 'ulti-game-list-button-delete');
            var view = this;
            bootbox.confirm({
                size: 'small',
                title: 'Confirm Delete',
                message: 'Do you really want to delete game vs. ' + game.get('opponentName') + '?<br/><br/>NOTE: you can un-delete the game later',
                callback: function (result) {
                    if (result == true) {
                        restService.promiseDeleteGame(appContext.currentTeamId(), game.get('gameId')).then(function () {
                            view.refresh();
                        }, function () {
                            view.showServerErrorDialog();
                        });
                    }
                }
            });
        },
        undeleteTapped: function (e) {
            var game = this.gameForButton(e.currentTarget, 'ulti-game-list-button-undelete');
            var view = this;
            restService.promiseUndeleteGame(appContext.currentTeamId(), game.get('gameId')).then(function () {
                view.refresh();
            }, function () {
                view.showServerErrorDialog();
            });
        },
        importTapped: function (e) {
            this.showImportDialog();
        },
        gameForButton: function (button, ultiId) {
            var gameId = $(button).attr(ultiId);
            return gameCollection.gameWithGameId(gameId);
        },
        showImportDialog: function () {
            var view = this;
            this.showModalDialog('Import Game', function () {
                var importDialog = new GameImportDialogView();
                importDialog.importComplete = function () {
                    appContext.refreshTeams(function () {
                        this.refresh();
                    }, function () {
                        view.showServerErrorDialog();
                    });
                };
                return importDialog;
            });
        },
        showGameVersionsDialog: function (game) {
            var view = this;
            this.showModalDialog('Game Versions', function () {
                var dialog = new GameVersionsDialogView();
                dialog.game = game;
                dialog.replaceComplete = function () {
                    appContext.refreshTeams(function () {
                        this.refresh();
                    }, function () {
                        view.showServerErrorDialog();
                    });
                };
                return dialog;
            });
        }
    });
    return GamesView;
});
define('templates/playersMergeOrDeleteDialogContent.html', [], function () {
    return '<div class="modal-body">\n    <div ulti-players-merge-dialog-description>\n        Merge player data from player: <b><%= player.get(\'name\') %></b>\n        <br><br>\n        You are choosing to move all of <b><%= player.get(\'name\') %></b>\'s data to another player. <b><%= player.get(\'name\') %></b> will be deleted when complete.\n        Choose the other player to whom the data should be moved and then click Merge.\n        <br><br>\n        Select player to receive <b><%= player.get(\'name\') %></b>\'s data:\n    </div>\n    <div ulti-players-delete-dialog-description>\n        Delete player: <b><%= player.get(\'name\') %></b>\n        <br><br>\n        When you delete this player the events associated with him/her must be moved to another player (or Anonymous). Choose the other player to whom the events should be moved and then click Delete.\n        <br><br>\n        Select player to receive <b><%= player.get(\'name\') %></b>\'s events:\n    </div>\n    <br>\n    <div class="dropdown">\n        <button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown"><%= selectedPlayer.get(\'name\') %>&nbsp;&nbsp;&nbsp;\n            <span class="caret"></span>\n        </button>\n        <ul class="dropdown-menu">\n            <% _.each(otherPlayers, function(player) { %>\n            <li><a href="#" ulti-player-choice="<%= player.get(\'name\') %>"><%= player.get(\'name\') %></a></li>\n            <% }); %>\n        </ul>\n    </div>\n</div>\n<div class="modal-footer" style="text-align: center">\n    <button type="button" class="btn btn-primary" ulti-players-button-action><%= actionName %></button>\n    <button type="button" class="btn btn-primary" ulti-players-button-cancel>Cancel</button>\n</div>';
});
define('views/PlayerMergeOrDeleteDialogView', [
    'jquery',
    'underscore',
    'backbone',
    'utility',
    'views/DialogView',
    'appContext',
    'collections/players',
    'bootbox',
    'restService',
    'templates/playersMergeOrDeleteDialogContent.html'
], function ($, _, Backbone, utility, DialogView, appContext, playerCollection, bootbox, restService, playersMergeOrDeleteDialogContentHtml) {
    var PlayerMergeOrDeleteDialogView = DialogView.extend({
        actionComplete: utility.noArgsNoReturnFunction,
        selectedPlayer: null,
        otherPlayers: null,
        isDeleteMode: false,
        initialize: function (options) {
            self = this;
            _.extend(this, _.pick(options, 'player', 'isDeleteMode'));
            self.otherPlayers = playerCollection.playersIncludingAnonymousButExcluding(self.player.get('name'));
            self.selectedPlayer = self.otherPlayers[0];
        },
        template: _.template(playersMergeOrDeleteDialogContentHtml),
        render: function () {
            self.$el.html(this.template({
                otherPlayers: self.otherPlayers,
                selectedPlayer: self.selectedPlayer,
                player: self.player,
                actionName: self.isDeleteMode ? 'Delete' : 'Merge'
            }));
            if (self.isDeleteMode) {
                self.$('[ulti-players-merge-dialog-description]').addClass('hidden');
            } else {
                self.$('[ulti-players-delete-dialog-description]').addClass('hidden');
            }
            self.$('[ulti-player-choice]').click(function (e) {
                e.preventDefault();
                var selectedPlayerName = e.currentTarget.attributes['ulti-player-choice'].value;
                self.selectedPlayer = playerCollection.playerWithName(selectedPlayerName);
                self.render();
            });
        },
        events: {
            'click [ulti-players-button-action]': 'actionTapped',
            'click [ulti-players-button-cancel]': 'cancelTapped'
        },
        actionTapped: function () {
            self = this;
            restService.promiseDeletePlayer(appContext.currentTeamId(), self.player.get('name'), self.selectedPlayer.get('name')).then(function () {
                self.dismiss();
                bootbox.alert({
                    size: 'small',
                    title: self.isDeleteMode ? 'Delete Complete' : 'Merge Complete',
                    message: 'Player <b>' + self.player.get('name') + '</b> deleted.  Associated data moved to player <b>' + self.selectedPlayer.get('name') + '</b>. If you still have games on your mobile device with player <b>' + self.player.get('name') + '</b> you should now download those games to your device (otherwise <b>' + self.player.get('name') + '</b> will re-appear when you next upload those games).'
                });
                self.actionComplete();
            }, function () {
                self.showServerErrorDialog();
            });
        },
        cancelTapped: function () {
            this.dismiss();
        }
    });
    return PlayerMergeOrDeleteDialogView;
});
define('templates/playerEditNamesDialogContent.html', [], function () {
    return '<div class="modal-body">\n    <div>\n        Edit names for player: <b><%= player.get(\'name\') %></b>\n    </div>\n    <br>\n    <div class="alert alert-danger" role="alert" style="display:none" ulti-player-nickname-error></div>\n    <div>\n        Nickname (also ID for this player):\n        <br>\n        <input type="text" class="form-control" ulti-player-nickname value="<%= player.get(\'name\') %>" maxlength="8"/>\n    </div>\n    <br><br>\n    <div>\n        Display first name:\n        <br>\n        <input type="text" class="form-control" ulti-player-first-name value="<%= player.get(\'firstName\') %>"/>\n    </div>\n    <br>\n    <div>\n        Display last name:\n        <br>\n        <input type="text" class="form-control" ulti-player-last-name value="<%= player.get(\'lastName\') %>"/>\n    </div>\n</div>\n<div class="modal-footer" style="text-align: center">\n    <div class="alert alert-danger" role="alert" style="display:none" ulti-player-name-error></div>\n    <button type="button" class="btn btn-primary" ulti-players-button-save>Save</button>\n    <button type="button" class="btn btn-primary" ulti-players-button-cancel>Cancel</button>\n</div>';
});
define('views/PlayerNameEditDialogView', [
    'jquery',
    'underscore',
    'backbone',
    'utility',
    'views/DialogView',
    'appContext',
    'collections/players',
    'bootbox',
    'restService',
    'templates/playerEditNamesDialogContent.html'
], function ($, _, Backbone, utility, DialogView, appContext, playerCollection, bootbox, restService, playerEditNamesDialogContentHtml) {
    var PlayerNameEditDialogView = DialogView.extend({
        actionComplete: utility.noArgsNoReturnFunction,
        player: null,
        initialize: function (options) {
            self = this;
            _.extend(this, _.pick(options, 'player'));
        },
        template: _.template(playerEditNamesDialogContentHtml),
        render: function () {
            self.$el.html(this.template({ player: self.player }));
        },
        events: {
            'click [ulti-players-button-save]': 'saveTapped',
            'click [ulti-players-button-cancel]': 'cancelTapped'
        },
        saveTapped: function () {
            this.clearErrorMessages();
            var oldNickName = this.trimString(this.player.get('name'));
            var oldFirstName = this.trimString(this.player.get('firstName'));
            var oldLastName = this.trimString(this.player.get('lastName'));
            var newNickName = this.trimString(this.$('[ulti-player-nickname]').val());
            var newFirstName = this.trimString(this.$('[ulti-player-first-name]').val());
            var newLastName = this.trimString(this.$('[ulti-player-last-name]').val());
            if (newNickName == '') {
                this.showError(this.$('[ulti-player-nickname-error]'), '<b>Invalid Nickname:</b> name cannot be blank');
            } else if (newNickName.toLowerCase() == 'anonymous' || newNickName.toLowerCase() == 'anon' || newNickName.toLowerCase() == 'unknown') {
                this.showError(this.$('[ulti-player-nickname-error]'), '<b>Invalid Nickname:</b> cannot rename to "anonymous"');
            } else if (newNickName.length > 8) {
                this.showError(this.$('[ulti-player-nickname-error]'), '<b>Name too long:</b> Sorry...nickname must be less than 9 characters');
            } else if (newNickName == oldNickName && newFirstName == oldFirstName && newLastName == oldLastName) {
                this.showError(this.$('[ulti-player-name-error]'), 'You did not change the nick name or display name');
            } else {
                restService.promiseRenamePlayer(appContext.currentTeamId(), oldNickName, newNickName, newFirstName, newLastName).then(function () {
                    var message = 'No changes made';
                    if (newNickName != oldNickName) {
                        message = 'Player <b>' + oldNickName + '</b> nickname (which is also the ID) changed to <b>' + newNickName + '</b>. If you still have games on your mobile device with player <b>' + oldNickName + '</b> you should now download the team and those games to your device (otherwise <b>' + oldNickName + '</b> will re-appear when you next upload those games).';
                    } else if (oldFirstName != newFirstName || oldLastName != newLastName) {
                        message = newLastName == '' && newFirstName == '' ? 'Player ' + oldNickName + ' display name removed.' : 'Player ' + oldNickName + ' display name changed to ' + newFirstName + ' ' + newLastName + '.';
                    }
                    self.dismiss();
                    bootbox.alert({
                        size: 'small',
                        title: 'Rename Complete',
                        message: message
                    });
                    self.actionComplete();
                }, function () {
                    alert('bad thang');
                });
            }
        },
        cancelTapped: function () {
            this.dismiss();
        },
        trimString: function (s) {
            if (s == null) {
                return '';
            }
            return jQuery.trim(s);
        },
        showError: function (errorEl, message) {
            errorEl.html(message);
            errorEl.show(400);
        },
        clearErrorMessages: function () {
            this.$('.alert-danger').hide();
        }
    });
    return PlayerNameEditDialogView;
});
define('templates/playerList.html', [], function () {
    return '<div class="container">\n    <% _.each(players, function(player) { %>\n    <div class="row" style="margin-bottom: 20px">\n        <div class="col-md-2">\n            <%= (isEmpty(player.number) ? \'\' : \'#\' + player.number + \' \') + player.name + (!isEmpty(player.lastName) || !isEmpty(player.firstName) ? \' (\' + player.firstName + \' \' + player.lastName + \')\' : \'\')%>\n        </div>\n        <div class="col-md-5">\n            <button ulti-player-list-button-editname ulti-player-nickname="<%= player.name %>" class="borderless-button" title="edit player\'s nick name or display name">Edit Name</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n            <button ulti-player-list-button-merge ulti-player-nickname="<%= player.name %>" class="borderless-button" title="merge player with other player">Merge</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n            <button ulti-player-list-button-delete ulti-player-nickname="<%= player.name %>" class="borderless-button" title="delete player"><i class="fa fa-trash-o" style="font-size: large"></i></button>\n        </div>\n    </div>\n    <% }); %>\n</div>';
});
define('templates/playerListEmpty.html', [], function () {
    return '<div style="margin-left: 40px">\n    No players for this team\n</div>\n\n';
});
define('views/PlayersView', [
    'jquery',
    'underscore',
    'backbone',
    'collections/players',
    'views/AbstractDetailContentsView',
    'views/PlayerMergeOrDeleteDialogView',
    'views/PlayerNameEditDialogView',
    'appContext',
    'restService',
    'templates/playerList.html',
    'templates/playerListEmpty.html'
], function ($, _, Backbone, playerCollection, AbstractDetailContentsView, PlayerMergeOrDeleteDialogView, PlayerNameEditDialogView, appContext, restService, playerListHtml, playerListEmptyHtml) {
    var PlayersView = AbstractDetailContentsView.extend({
        el: '[ulti-team-detail-players]',
        initialize: function () {
            self = this;
            playerCollection.on('reset', this.render, this);
        },
        events: {
            'click [ulti-player-list-button-editname]': 'editTapped',
            'click [ulti-player-list-button-merge]': 'mergeTapped',
            'click [ulti-player-list-button-delete]': 'deleteTapped'
        },
        template: _.template(playerListHtml),
        noPlayersTemplate: _.template(playerListEmptyHtml),
        render: function () {
            if (playerCollection.isEmpty()) {
                this.$el.html(this.noPlayersTemplate());
            } else {
                var players = _.map(playerCollection.models, function (player) {
                    return player.toJSON();
                });
                this.$el.html(this.template({ players: players }));
            }
        },
        refresh: function () {
            var view = this;
            restService.promiseRetrieveTeamForAdmin(appContext.currentTeamId(), true, true).then(function (team) {
                playerCollection.populateFromRestResponse(team.players);
                self.render();
            }, function () {
                view.showServerErrorDialog();
            });
        },
        editTapped: function (e) {
            var player = this.playerForButton(e.currentTarget);
            this.showEditNameDialog(player);
        },
        mergeTapped: function (e) {
            var player = this.playerForButton(e.currentTarget);
            this.showMergeDialog(player);
        },
        deleteTapped: function (e) {
            var player = this.playerForButton(e.currentTarget);
            this.showDeleteDialog(player);
        },
        playerForButton: function (button) {
            var playerName = $(button).attr('ulti-player-nickname');
            return playerCollection.playerWithName(playerName);
        },
        showMergeDialog: function (player) {
            view = this;
            this.showModalDialog('Merge Player', function () {
                var dialog = new PlayerMergeOrDeleteDialogView({
                    player: player,
                    isDeleteMode: false
                });
                dialog.actionComplete = function () {
                    view.refresh();
                };
                return dialog;
            });
        },
        showDeleteDialog: function (player) {
            view = this;
            this.showModalDialog('Delete Player', function () {
                var dialog = new PlayerMergeOrDeleteDialogView({
                    player: player,
                    isDeleteMode: true
                });
                dialog.actionComplete = function () {
                    view.refresh();
                };
                return dialog;
            });
        },
        showEditNameDialog: function (player) {
            view = this;
            this.showModalDialog('Edit Player Names', function () {
                var dialog = new PlayerNameEditDialogView({ player: player });
                dialog.actionComplete = function () {
                    view.refresh();
                };
                return dialog;
            });
        }
    });
    return PlayersView;
});
define('views/TeamDetailView', [
    'jquery',
    'underscore',
    'backbone',
    'collections/players',
    'collections/games',
    'views/TabView',
    'views/SettingView',
    'views/GamesView',
    'views/PlayersView',
    'views/UltiView',
    'appContext',
    'restService'
], function ($, _, Backbone, playerCollection, gameCollection, TabView, SettingView, GamesView, PlayersView, UltiView, appContext, restService) {
    var TeamDetailView = UltiView.extend({
        el: '[ulti-team-detail]',
        initialize: function () {
            this.tabView = new TabView();
            this.settingsView = new SettingView();
            this.gamesView = new GamesView();
            this.playersView = new PlayersView();
            appContext.on('change:currentTeam', this.teamChanged, this);
            appContext.on('change:currentTab', this.tabChanged, this);
        },
        teamChanged: function () {
            this.render();
        },
        tabChanged: function () {
            this.render();
        },
        render: function () {
            this.settingsView.$el.toggleClass('hidden', appContext.currentTab() != 'settings');
            this.gamesView.$el.toggleClass('hidden', appContext.currentTab() != 'games');
            this.playersView.$el.toggleClass('hidden', appContext.currentTab() != 'players');
            switch (appContext.currentTab()) {
            case 'players':
                this.renderPlayersView();
                break;
            case 'games':
                this.renderGamesView();
                break;
            default:
                this.renderSettingsView();
            }
            return this;
        },
        renderSettingsView: function () {
            this.settingsView.render();
        },
        renderGamesView: function () {
            var view = this;
            restService.promiseRetrieveGamesForAdmin(appContext.currentTeamId()).then(function (games) {
                gameCollection.populateFromRestResponse(games);
            }, function () {
                view.showServerErrorDialog();
            });
        },
        renderPlayersView: function () {
            var view = this;
            restService.promiseRetrieveTeamForAdmin(appContext.currentTeamId(), true, true).then(function (team) {
                playerCollection.populateFromRestResponse(team.players);
            }, function () {
                view.showServerErrorDialog();
            });
        }
    });
    return TeamDetailView;
});
define('models/user', [
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {
    var User = Backbone.Model.extend({ defaults: { 'email': '' } });
    return User;
});
define('views/AppView', [
    'jquery',
    'underscore',
    'backbone',
    'collections/teams',
    'views/TeamSelectorView',
    'views/TeamStatsBasicInfoView',
    'views/TeamDetailView',
    'appContext',
    'models/user',
    'views/UltiView'
], function ($, _, Backbone, teamCollection, TeamSelectorView, TeamStatsBasicInfoView, TeamDetailView, appContext, User, UltiView) {
    var AppView = UltiView.extend({
        el: '[ulti-app]',
        initialize: function () {
            this.teamSelectorView = new TeamSelectorView();
            this.teamStatsBasicInfoView = new TeamStatsBasicInfoView();
            this.teamDetailView = new TeamDetailView();
        },
        render: function () {
            var selectedTeam = appContext.currentTeam();
            var selectedTab = appContext.currentTab();
            var self = this;
            teamCollection.ensureFetched(function () {
                var teams = teamCollection.models;
                if (teams.length > 0) {
                    $('[ulti-teams-container]').show();
                    $('[ulti-teams-no-teams]').hide();
                    if (selectedTeam) {
                        var refreshedSelectedTeam = teamCollection.teamWithCloudId(selectedTeam.get('cloudId'));
                        appContext.set('currentTeam', refreshedSelectedTeam);
                        if (selectedTab) {
                            appContext.set('currentTab', selectedTab);
                        }
                    }
                } else {
                    $('[ulti-teams-container]').hide();
                    $('[ulti-teams-no-teams]').show();
                }
            }, function () {
                self.showServerErrorDialog();
            });
            return this;
        }
    });
    return AppView;
});
define('router', [
    'jquery',
    'underscore',
    'backbone',
    'appContext',
    'collections/teams',
    'collections/games',
    'collections/players',
    'views/AppView',
    'appContext',
    'bootbox'
], function ($, _, Backbone, appContext, teamCollection, gameCollection, playerCollection, AppView, appContext, bootbox) {
    var AppRouter = Backbone.Router.extend({
        appView: null,
        routes: {
            'team/:cloudId/:tab': 'team',
            '*path': 'defaultRoute'
        },
        initialize: function () {
            this.appView = new AppView();
        },
        defaultRoute: function (path) {
            var self = this;
            if (appContext.hasCurrentUser()) {
                teamCollection.ensureFetched(function () {
                    if (!teamCollection.isEmpty()) {
                        appContext.selectDefaultTeam();
                        appContext.set('currentTab', 'settings');
                    }
                    self.appView.render();
                }, function () {
                    self.showServerErrorAlert();
                });
            }
        },
        team: function (cloudId, tab) {
            console.log('routed to cloud = ' + cloudId + ' tab = ' + tab);
            var self = this;
            teamCollection.ensureFetched(function () {
                var teamChange = appContext.currentTeamId() != cloudId;
                appContext.set('currentTeam', teamCollection.teamWithCloudId(cloudId));
                appContext.set('currentTab', tab == null ? 'settings' : tab);
                if (teamChange) {
                    gameCollection.reset();
                    playerCollection.reset();
                }
            }, function () {
                self.showServerErrorAlert();
            });
        },
        showServerErrorAlert: function () {
            bootbox.alert({
                size: 'small',
                title: 'Server Error',
                message: 'Ouch...we experienced an error trying to talk to our server.<br/><br/>Please try again by refreshing your browser.<br/><br/>If the problem persists, please notify us at <a href="mailto:support@ultianalytics.com">support@ultianalytics.com</a>.'
            });
        }
    });
    return new AppRouter();
});
define('views/LogoffView', [
    'jquery',
    'underscore',
    'backbone',
    'appContext'
], function ($, _, Backbone, appContext) {
    var LogoffView = Backbone.View.extend({
        el: '[ulti-logoff-button]',
        events: { 'click': 'logoffClicked' },
        initialize: function () {
            appContext.on('change:currentUser', this.userChanged, this);
        },
        userChanged: function () {
            this.render();
        },
        logoffClicked: function () {
            var urlWithoutHashTag = window.location.href.split('#')[0];
            document.location.href = 'https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=' + urlWithoutHashTag;
        },
        render: function () {
            if (appContext.hasCurrentUser()) {
                this.$el.show();
            } else {
                this.$el.hide();
            }
            return this;
        }
    });
    return LogoffView;
});
define('views/SignedOnUserView', [
    'jquery',
    'underscore',
    'backbone',
    'appContext'
], function ($, _, Backbone, appContext) {
    var SignedOnUserView = Backbone.View.extend({
        el: '[ulti-user]',
        initialize: function () {
            appContext.on('change:currentUser', this.userChanged, this);
        },
        userChanged: function () {
            this.render();
        },
        render: function () {
            this.$el.html(appContext.currentUserEmail());
        }
    });
    return SignedOnUserView;
});
define('app', [
    'jquery',
    'underscore',
    'backbone',
    'bootstrap',
    'appContext',
    'router',
    'views/AppView',
    'models/user',
    'restService',
    'views/LogoffView',
    'views/SignedOnUserView'
], function ($, _, Backbone, bootstrap, appContext, router, appView, User, restService, LogoffView, SignedOnUserView) {
    return {
        initialize: function () {
            var logoffView = new LogoffView();
            logoffView.render();
            var userView = new SignedOnUserView();
            userView.render();
            var profile = GoogleUser.getBasicProfile();
            var user = new User();
            user.set('email', profile.getEmail());
            appContext.set('currentUser', user);
            restService.accessToken = GoogleUser.getAuthResponse().access_token;
            $('[ulti-signon]').css('display', 'none');
            $('[ulti-app-content]').css('display', 'block');
            var router = require('router');
            router.navigate('/', { trigger: true });
            Backbone.history.start();
        }
    };
});
require.config({
    baseUrl: 'js',
    waitSeconds: 60,
    shim: {
        'bootstrap': { 'deps': ['jquery'] },
        'q': {}
    },
    paths: {
        'jquery': 'https://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.3/jquery.min',
        'underscore': 'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min',
        'backbone': 'https://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.2.3/backbone-min',
        'bootstrap': 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.5/js/bootstrap.min',
        'bootbox': 'https://cdnjs.cloudflare.com/ajax/libs/bootbox.js/4.4.0/bootbox.min',
        'q': 'https://cdnjs.cloudflare.com/ajax/libs/q.js/1.4.1/q.min'
    }
});
require(['app'], function (App) {
    App.initialize();
});
define('main', ['app'], function () {
    return;
});