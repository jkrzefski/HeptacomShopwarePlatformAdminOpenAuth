<?php declare(strict_types=1);

namespace Heptacom\AdminOpenAuth\Provider;

use Heptacom\AdminOpenAuth\Contract\ClientInterface;
use Heptacom\AdminOpenAuth\Contract\ProviderInterface;
use Heptacom\AdminOpenAuth\Contract\TokenPairFactoryInterface;
use Heptacom\AdminOpenAuth\Exception\ProvideClientInvalidConfigurationException;
use Shopware\Core\Framework\Context;

class JiraProvider implements ProviderInterface
{
    /**
     * @var TokenPairFactoryInterface
     */
    private $tokenPairFactory;

    public function __construct(TokenPairFactoryInterface $tokenPairFactory)
    {
        $this->tokenPairFactory = $tokenPairFactory;
    }

    public function provides(): string
    {
        return 'jira';
    }

    public function provideClient(string $clientId, array $config, Context $context): ClientInterface
    {
        if (!array_key_exists('appId', $config)) {
            throw new ProvideClientInvalidConfigurationException($clientId, self::class, 'appId missing');
        }

        if (!array_key_exists('appSecret', $config)) {
            throw new ProvideClientInvalidConfigurationException($clientId, self::class, 'appSecret missing');
        }

        if (!array_key_exists('redirectUri', $config)) {
            throw new ProvideClientInvalidConfigurationException($clientId, self::class, 'redirectUri missing');
        }

        $storeToken = array_key_exists('storeToken', $config) && $config['storeToken'];

        $appId = $config['appId'];
        $appSecret = $config['appSecret'];
        $redirectUri = $config['redirectUri'];

        return new JiraClient($this->tokenPairFactory, $appId, $appSecret, $redirectUri, $storeToken);
    }
}