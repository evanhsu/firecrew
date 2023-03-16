<?php
 
namespace App\Listeners;
 
use App\Events\ResourceStatusUpdated;
use App\Domain\Crews\Crew;
use Illuminate\Support\Facades\Log;
use GuzzleHttp\Client;

 
class SendWebhook
{
    private $client;

    /**
     * Create the event listener.
     */
    public function __construct()
    {
        $this->client = new Client([
            // 'base_uri' => 'https://hooks.slack.com',
            // 'timeout'  => 2.0,
        ]);
    }
 
    /**
     * Handle the event.
     */
    public function handle(ResourceStatusUpdated $event): void
    {
        $status = $event->resourceStatus;

        $location = strlen($status->assigned_fire_name) > 0 ? "{$status->location_name} ({$status->assigned_fire_name})" : "{$status->location_name}";
        $incidents = implode(
            '',
            array_map(function($incident) {
                return " - {$incident}\n";
            }, explode("\n", $status->comments1))
        );
        $firecrewBaseUrl = config('app.url');

        $blocks = [
            [
                "type" => "divider"
            ],
            [
                "type" => "section",
                "text" => [
                    "type" => "mrkdwn",
                    "text" => "*{$status->crew_name}* posted an update for *{$status->statusable_resource_name}*",
                ]
            ],
            [
                "type" => "section",
                "fields" => [
                    [
                        "type" => "mrkdwn",
                        "text" => "*{$status->staffing_category1}*: {$status->staffing_value1}",
                    ],
                    [
                        "type" => "mrkdwn",
                        "text" => "*Location*:\n{$location}",
                    ],
                    [
                        "type" => "mrkdwn",
                        "text" => "*Staffed Incidents*:\n{$incidents}",
                    ],
                    [
                        "type" => "mrkdwn",
                        "text" => "*Info*:\n{$status->comments2}",
                    ],
                ]
            ],
            [
                "type" => "section",
                "text" => [
                    "type" => "mrkdwn",
                    "text" => "{$firecrewBaseUrl}/summary",
                ]
            ],
        ];

        // For each Crew, send message to the webhook URL
        foreach(Crew::all() as $crew) {

            try {
                if (isset($crew->webhook_url) && strlen($crew->webhook_url) > 0) {
                    $this->client->request('POST', $crew->webhook_url, [
                        'headers' => [
                            'Content-type' => 'application/json',
                        ],
                        'json' => [
                            'blocks' => $blocks
                        ],
                    ]);
                }
            } catch(\Error $e) {
                Log::error("Error sending webhook to URL for Crew X", [$e]);
            }
        }
    }
}