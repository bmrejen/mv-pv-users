<?php

namespace MarcoVasco\Switchvox;

use GuzzleHttp\Client;

class Request
{
    /**
     * Hostname
     * @var string
     */
    protected $hostname;

    /**
     * Username
     * @var string
     */
    protected $username;

    /**
     * Password
     * @var string
     */
    protected $password;

    /**
     * Uri
     * @var uri
     */
    protected $uri;

    /**
     * Client
     * @var Client
     */
    protected $client;

    /**
     * Constructor
     *
     * @param string $hostname
     * @param string $username
     * @param string $password
     */
    public function __construct($hostname, $username, $password)
    {
      $this->setHostname($hostname);
      $this->setUsername($username);
      $this->setPassword($password);
      $this->setUri("https://" . $this->getHostname() . "/json");

      $this->setClient(new Client);
    }

    /**
     * Set hostname
     *
     * @param  string  $hostname
     * @return Request
     */
    public function setHostname($hostname)
    {
      $this->hostname = $hostname;
      return $this;
    }

    /**
     * Get hostname
     *
     * @return string
     */
    public function getHostname()
    {
      return $this->hostname;
    }

    /**
     * Set username
     *
     * @param  string  $username
     * @return Request
     */
    public function setUsername($username)
    {
      $this->username = $username;
      return $this;
    }

    /**
     * Get username
     *
     * @return string
     */
    public function getUsername()
    {
      return $this->username;
    }

    /**
     * Set password
     *
     * @param  string  $password
     * @return Request
     */
    public function setPassword($password)
    {
      $this->password = $password;
      return $this;
    }

    /**
     * Get password
     *
     * @return string
     */
    public function getPassword()
    {
      return $this->password;
    }

    /**
     * Set uri
     *
     * @param  string  $uri
     * @return Request
     */
    public function setUri($uri)
    {
      $this->uri = $uri;
      return $this;
    }

    /**
     * Get uri
     *
     * @return string
     */
    public function getUri()
    {
      return $this->uri;
    }

    /**
     * Set client
     *
     * @param  Client  $client
     * @return Request
     */
    public function setClient(Client $client)
    {
      $this->client = $client;
      return $this;
    }

    /**
     * Get client
     *
     * @return Client
     */
    public function getClient()
    {
      return $this->client;
    }

    /**
     * Send request
     *
     * @param  string $method
     * @param  array  $params
     * @return mixed
     */
    public function send($method, array $params = [])
    {
      $requestParams  = $this->prepareRequest($method, $params);

      $result = $this->getClient()->request(
        'POST',
        $this->getUri(),
        [
          'body'      => $requestParams,
          'verify'    => false,
          'headers'   => [
            'Content-Type' => 'application/json',
          ],
          'auth'      => [
            $this->getUsername(),
            $this->getPassword(),
            'digest'
          ],
        ]
      );

      return json_decode((string)$result->getBody());
    }

    /**
     * Prepare and encode request to json
     *
     * @param  string $method
     * @param  array  $params
     * @return string
     */
    protected function prepareRequest($method, array $params = [])
    {
      $request = [
        'request' => [
          'method'        => $method,
          'parameters'    => (object)$params,
        ],
      ];

      return json_encode($request);
    }
  }

  use MarcoVasco\Switchvox\Request;

  $request    = new Request($host, $user, $password);
  $result     = $request->send($query, $params);
