import {
	isFederationAddServerProps,
	isFederationRemoveServerProps,
	isFederationSearchPublicRoomsProps,
	isFederationJoinExternalPublicRoomProps,
} from '@rocket.chat/rest-typings';
import { Federation } from '@rocket.chat/core-services';

import { API } from '../../../../app/api/server';
import { getPaginationItems } from '../../../../app/api/server/helpers/getPaginationItems';

API.v1.addRoute(
	'federation/searchPublicRooms',
	{
		authRequired: true,
		validateParams: isFederationSearchPublicRoomsProps,
	},
	{
		async get() {
			const { count } = await getPaginationItems(this.queryParams);
			const { serverName, roomName, pageToken } = this.queryParams;

			const result = await Federation.searchPublicRooms(serverName, roomName, pageToken, count);

			return API.v1.success(result);
		},
	},
);

API.v1.addRoute(
	'federation/listServersByUser',
	{
		authRequired: true,
	},
	{
		async get() {
			const servers = await Federation.getSearchedServerNamesByInternalUserId(this.userId);

			return API.v1.success({
				servers,
			});
		},
	},
);

API.v1.addRoute(
	'federation/addServerByUser',
	{
		authRequired: true,
		validateParams: isFederationAddServerProps,
	},
	{
		async post() {
			const { serverName } = this.bodyParams;

			await Federation.addSearchedServerNameByInternalUserId(this.userId, serverName);

			return API.v1.success();
		},
	},
);

API.v1.addRoute(
	'federation/removeServerByUser',
	{
		authRequired: true,
		validateParams: isFederationRemoveServerProps,
	},
	{
		async post() {
			const { serverName } = this.bodyParams;

			await Federation.removeSearchedServerNameByInternalUserId(this.userId, serverName);

			return API.v1.success();
		},
	},
);

API.v1.addRoute(
	'federation/joinExternalPublicRoom',
	{
		authRequired: true,
		validateParams: isFederationJoinExternalPublicRoomProps,
	},
	{
		async post() {
			const { externalRoomId, roomName, pageToken } = this.bodyParams;

			await Federation.scheduleJoinExternalPublicRoom(this.userId, externalRoomId, roomName, decodeURIComponent(pageToken || ''));

			return API.v1.success();
		},
	},
);
