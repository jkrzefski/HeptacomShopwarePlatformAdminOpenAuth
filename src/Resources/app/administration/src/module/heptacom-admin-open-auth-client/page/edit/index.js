import template from './heptacom-admin-open-auth-client-edit-page.html.twig';

const { Component, Context, Mixin } = Shopware;

Component.register('heptacom-admin-open-auth-client-edit-page', {
    template,

    inject: [
        'repositoryFactory',
        'HeptacomAdminOpenAuthProviderApiService',
    ],

    mixins: [
        Mixin.getByName('placeholder'),
        Mixin.getByName('notification'),
    ],

    props: {
        clientId: {
            required: true,
            type: String
        }
    },

    data() {
        return {
            isLoading: true,
            isSaveSuccessful: false,
            item: null,
            showDeleteModal: false,
            redirectUri: null
        }
    },

    created() {
        this.loadData();
    },

    computed: {
        dynamicName() {
            return this.placeholder(this.item, 'name', this.$t('heptacom-admin-open-auth-client.pages.edit.title'));
        },

        clientRepository() {
            return this.repositoryFactory.create('heptacom_admin_open_auth_client');
        }
    },

    methods: {
        loadData() {
            this.isLoading = true;

            this.loadClient().finally(() => {
                this.isLoading = false;
            });
        },

        loadClient() {
            this.item = null;

            return this.clientRepository
                .get(this.clientId, Context.api)
                .then(item => {
                    this.item = item;

                    return this.HeptacomAdminOpenAuthProviderApiService.getRedirectUri(item.id);
                })
                .then(redirectUri => {
                    this.redirectUri = redirectUri.target;
                });
        },

        cancelEdit() {
            this.$router.push({ name: this.$route.meta.parentPath });
        },

        saveItem() {
            this.isLoading = true;

            this.clientRepository
                .save(this.item, Context.api)
                .then(() => {
                    this.isSaveSuccessful = true;

                    return this.loadData();
                })
                .catch(exception => {
                    const clientName = this.client.name;
                    this.createNotificationError({
                        title: this.$tc('global.notification.notificationSaveErrorTitle'),
                        message: this.$tc(
                            'global.notification.notificationSaveErrorMessage', 0, { entityName: clientName }
                        )
                    });

                    throw exception;
                })
                .finally(() => {
                    this.isLoading = false;
                });
        },

        onConfirmDelete() {
            this.showDeleteModal = false;
            this.isLoading = true;

            return this.clientRepository
                .delete(this.item.id, Context.api)
                .then(() => {
                    this.$router.push({ name: 'heptacom.admin.open.auth.client.settings' });
                })
                .catch(exception => {
                    const clientName = this.client.name;
                    this.createNotificationError({
                        title: this.$tc('global.notification.notificationSaveErrorTitle'),
                        message: this.$tc(
                            'global.notification.notificationSaveErrorMessage', 0, { entityName: clientName }
                        )
                    });

                    throw exception;
                })
                .finally(() => {
                    this.isLoading = false;
                });
        }
    }
});
