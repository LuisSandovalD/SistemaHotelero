<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Room;
use App\Models\TypeRoom;
use App\Models\Reservation;
use Carbon\Carbon;
use App\Models\RoomStatus;
use App\Models\Payments;
use App\Models\User;
use Inertia\Inertia;

use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function show(){

        $countRoom = Room::wherehas('roomStatus', function($query){$query->where('nombre',"Disponible");})->count();
        $countRoomDispo = Room::count();
        if($countRoomDispo && $countRoom){
             $porcentaje = ($countRoom / $countRoomDispo)*100;
        }else{
            $porcentaje=0;
        }

        $countReservation = Reservation::whereMonth('created_at', Carbon::now()->month)->whereYear('created_at', Carbon::now()->year)->count();

        $countUserGuest = User::role(['user'])->count();
        $countUserProvider = User::role(['proveedor'])->count();
        $countUserRecep = User::role(['recepcionista'])->count();

        $countUserTotal = User::all()->count();

        $sumTotal = Payments::whereMonth('created_at', Carbon::now()->month)->whereYear('created_at', Carbon::now()->year)->sum('monto');
        $sumTotalYear = Payments::whereMonth('created_at', Carbon::now()->month)->whereYear('created_at', Carbon::now()->year)->sum('monto');

        $reservationsByMonth = Reservation::selectRaw('MONTH(created_at) as month, COUNT(*) as total')->whereYear('created_at', Carbon::now()->year)->groupBy('month')->pluck('total','month');
        $reservationsByDay = Reservation::selectRaw('DAYOFWEEK(created_at) as day, COUNT(*) as total')->whereMonth('created_at', Carbon::now()->month)->whereYear('created_at', Carbon::now()->year)->groupBy('day')->pluck('total','day');

        $RoomOcupadas = Room::where('room_status_id','2')->count();
        $RoomIndividual = Room::where('type_rooms_id','1')->count();
        $typeRoomDoble= Room::where('type_rooms_id','2')->count();
        $typeRoomSuite= Room::where('type_rooms_id','3')->count();
        
        return Inertia::render('dashboard', [
            'countRoom'=>$countRoom,
            'countRoomDispo'=>$countRoomDispo,
            'porcentaje'=>$porcentaje,
            'countReservation'=>$countReservation,
            'countUser'=>$countUserGuest,
            'countTotal'=>$sumTotal,
            'countUserTotal'=>$countUserTotal,
            'countUserProvider'=> $countUserProvider,
            'countUserRecep'=> $countUserRecep,
            'typeRoomIndividual' => $RoomIndividual,
            'typeRoomDoble'=>$typeRoomDoble,
            'typeRoomSuite'=>$typeRoomSuite,
            'sumTotalYear'=>$sumTotalYear,
            'reservationsByMonth'=>$reservationsByMonth,
            'reservationsByDay'=>$reservationsByDay,
            'RoomOcupadas'=>$RoomOcupadas,
        ]);
    }
}
