<?php

namespace App\Http\Controllers\Status;

use App\Http\Controllers\Controller;
use App\Domain\Crews\Crew;
use Illuminate\Http\Request;

//use App\Http\Transformers\CrewTransformer;
//use League\Fractal\Manager;

class SummaryController extends Controller
{
    public function indexTempRedirect(Request $request)
    {
        $request->session()->flash('active_menubutton', 'summary'); // Tell the menubar which button to highlight
        $request->session()->flash('alert', [
            'message' => 'Update your bookmark! This page will be moving to https://firecrew.us/summary'
        ]);
        return redirect(route('summary'));
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $request->session()->flash('active_menubutton', 'summary'); // Tell the menubar which button to highlight
        return view('summary');
    }

    public function indexApi(Request $request)
    {
        return $this->getData()->toJson();
//        $modifiedCrews = $crews->map(function ($crew) {
//            $crew->status->updated_at = $crew->updated_at;
//            return $crew;
//        });
//
//        return $modifiedCrews->toJson();

//        return $this->response->collection(
//            $crews,
//            new CrewTransformer,
//            ['key' => 'crew'],
//            function ($crews, Manager $fractal) {
//                $fractal->parseIncludes(array_merge(
//                    ['status', 'resources'],
//                    $fractal->getRequestedIncludes()
//                ));
//            }
//        );
    }

    private function getData()
    {
        return Crew::with(['status', 'statusableResources.latestStatus'])->orderBy('crews.name')->get();
    }
}
