import { Meteor } from 'meteor/meteor';
import {
	isUploadImportFileParamsPOST,
	isDownloadPublicImportFileParamsPOST,
	isStartImportParamsPOST,
	isGetImportFileDataParamsGET,
	isGetImportProgressParamsGET,
	isGetLatestImportOperationsParamsGET,
	isDownloadPendingFilesParamsPOST,
	isDownloadPendingAvatarsParamsPOST,
	isGetCurrentImportOperationParamsGET,
	isImportAddUsersParamsPOST,
} from '@rocket.chat/rest-typings';
import { Imports } from '@rocket.chat/models';
import { Import } from '@rocket.chat/core-services';

import { API } from '../api';
import { Importers } from '../../../importer/server';
import {
	executeUploadImportFile,
	executeDownloadPublicImportFile,
	executeGetImportProgress,
	executeGetImportFileData,
	executeStartImport,
	executeGetLatestImportOperations,
} from '../../../importer/server/methods';

API.v1.addRoute(
	'uploadImportFile',
	{
		authRequired: true,
		validateParams: isUploadImportFileParamsPOST,
	},
	{
		async post() {
			const { binaryContent, contentType, fileName, importerKey } = this.bodyParams;

			return API.v1.success(await executeUploadImportFile(this.userId, binaryContent, contentType, fileName, importerKey));
		},
	},
);

API.v1.addRoute(
	'downloadPublicImportFile',
	{
		authRequired: true,
		validateParams: isDownloadPublicImportFileParamsPOST,
		permissionsRequired: ['run-import'],
	},
	{
		async post() {
			const { fileUrl, importerKey } = this.bodyParams;
			await executeDownloadPublicImportFile(this.userId, fileUrl, importerKey);

			return API.v1.success();
		},
	},
);

API.v1.addRoute(
	'startImport',
	{
		authRequired: true,
		validateParams: isStartImportParamsPOST,
		permissionsRequired: ['run-import'],
	},
	{
		async post() {
			const { input } = this.bodyParams;

			await executeStartImport({ input }, this.userId);

			return API.v1.success();
		},
	},
);

API.v1.addRoute(
	'getImportFileData',
	{
		authRequired: true,
		validateParams: isGetImportFileDataParamsGET,
		permissionsRequired: ['run-import'],
	},
	{
		async get() {
			const result = await executeGetImportFileData();

			return API.v1.success(result);
		},
	},
);

API.v1.addRoute(
	'getImportProgress',
	{
		authRequired: true,
		validateParams: isGetImportProgressParamsGET,
		permissionsRequired: ['run-import'],
	},
	{
		async get() {
			const result = await executeGetImportProgress();
			return API.v1.success(result);
		},
	},
);

API.v1.addRoute(
	'getLatestImportOperations',
	{
		authRequired: true,
		validateParams: isGetLatestImportOperationsParamsGET,
		permissionsRequired: ['view-import-operations'],
	},
	{
		async get() {
			const result = await executeGetLatestImportOperations();
			return API.v1.success(result);
		},
	},
);

API.v1.addRoute(
	'downloadPendingFiles',
	{
		authRequired: true,
		validateParams: isDownloadPendingFilesParamsPOST,
		permissionsRequired: ['run-import'],
	},
	{
		async post() {
			const importer = Importers.get('pending-files');
			if (!importer) {
				throw new Meteor.Error('error-importer-not-defined', 'The Pending File Importer was not found.', 'downloadPendingFiles');
			}

			const operation = await Import.newOperation(this.userId, importer.name, importer.key);

			importer.instance = new importer.importer(importer, operation); // eslint-disable-line new-cap
			const count = await importer.instance.prepareFileCount();

			return API.v1.success({
				count,
			});
		},
	},
);

API.v1.addRoute(
	'downloadPendingAvatars',
	{
		authRequired: true,
		validateParams: isDownloadPendingAvatarsParamsPOST,
		permissionsRequired: ['run-import'],
	},
	{
		async post() {
			const importer = Importers.get('pending-avatars');
			if (!importer) {
				throw new Meteor.Error('error-importer-not-defined', 'The Pending File Importer was not found.', 'downloadPendingAvatars');
			}

			const operation = await Import.newOperation(this.userId, importer.name, importer.key);
			importer.instance = new importer.importer(importer, operation); // eslint-disable-line new-cap
			const count = await importer.instance.prepareFileCount();

			return API.v1.success({
				count,
			});
		},
	},
);

API.v1.addRoute(
	'getCurrentImportOperation',
	{
		authRequired: true,
		validateParams: isGetCurrentImportOperationParamsGET,
		permissionsRequired: ['run-import'],
	},
	{
		async get() {
			const operation = await Imports.findLastImport();
			return API.v1.success({
				operation,
			});
		},
	},
);

API.v1.addRoute(
	'import.clear',
	{
		authRequired: true,
		permissionsRequired: ['run-import'],
	},
	{
		async post() {
			await Import.clear();

			return API.v1.success();
		},
	},
);

API.v1.addRoute(
	'import.new',
	{
		authRequired: true,
		permissionsRequired: ['run-import'],
	},
	{
		async post() {
			const operation = await Import.newOperation(this.userId, 'api', 'api');

			return API.v1.success({ operation });
		},
	},
);

API.v1.addRoute(
	'import.status',
	{
		authRequired: true,
		permissionsRequired: ['run-import'],
	},
	{
		async get() {
			const status = await Import.status();

			return API.v1.success(status);
		},
	},
);

API.v1.addRoute(
	'import.addUsers',
	{
		authRequired: true,
		validateParams: isImportAddUsersParamsPOST,
		permissionsRequired: ['run-import'],
	},
	{
		async post() {
			const { users } = this.bodyParams;

			await Import.addUsers(users);

			return API.v1.success();
		},
	},
);

API.v1.addRoute(
	'import.run',
	{
		authRequired: true,
		permissionsRequired: ['run-import'],
	},
	{
		async post() {
			await Import.run(this.userId);

			return API.v1.success();
		},
	},
);
