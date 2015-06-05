/**
 * Description:
 *   Find out who's going to lunch today. All lunch plans are automatically
 *   deleted if none have been set in more than 16 hours.
 *
 * Commands:
 *   hubot lunchplans list - Lists all of today's lunch plans.
 *   hubot lunchplans add <text> - Adds you to a lunch plan.
 *   hubot lunchplans with <username> - Adds you to another user's lunch plans.
 *   hubot lunchplans never mind - Removes you from any lunch plans.
 */

'use strict';

var _ = require('lodash');

module.exports = function (robot) {
    function getPlans () {
        var now = Date.now();

        // clear lunch plans if older than 16 hrs
        var plans = _.filter(robot.brain.get('lunchPlans'), function(plan) {
            return now - plan.date < 1000 * 60 * 60 * 16;
        });

        setPlans(plans);

        return plans || {};
    }

    function setPlans (plans) {
        robot.brain.set('lunchPlans', plans);
    }

    function addPlan (name, who) {
        var plans = getPlans();

        var plan = plans[name.toLowerCase()] || {
            name: name,
            who: [],
            date: Date.now()
        };

        if (!_.contains(plan.who, who)) {
            plan.who.push(who);
        }

        plans[name.toLowerCase()] = plan;

        setPlans(plans);

        return plan;
    }

    function removePlan (who) {
        var plans = getPlans();

        _.each(plans, function (plan, key) {
            if (_.contains(plan.who, who)) {
                plan.who = _.without(plan.who, who);

                if (!plan.who.length) {
                    delete plans[key];
                }
            }
        });

        setPlans(plans);
    }

    function formatPlan (plan) {
        return plan.name + ': ' + plan.who.join(', ');
    }

    function formatPlans () {
        var plans = getPlans();

        if (_.isEmpty(plans)) {
            return 'No one has any lunch plans today.';
        } else {
            return _.map(getPlans(), formatPlan).join('\n');
        }
    }

    function findUserPlan (user) {
        return _.find(getPlans(), function (plan) {
            return _.contains(plan.who, user);
        });
    }

    robot.respond(/lunchplans list/i, function (res) {
        res.send(formatPlans());
    });

    robot.respond(/lunchplans add (.*)/i, function (res) {
        var plan = addPlan(res.match[1], res.message.user.name);
        res.send(formatPlan(plan));
    });

    robot.respond(/lunchplans with (.*)/i, function (res) {
        var user = res.match[1];
        var userPlan = findUserPlan(user);

        if (userPlan) {
            var plan = addPlan(userPlan.name, res.message.user.name);
            res.send(formatPlan(plan));
        } else {
            res.reply('User ' + user + ' has no lunch plans today.');
        }
    });

    robot.hear(/lunchplans never mind/i, function (res) {
        var user = res.message.user.name;
        removePlan(user);
        res.send(formatPlans());
    });
};
