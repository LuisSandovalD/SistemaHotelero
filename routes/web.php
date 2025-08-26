<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\User;
use App\Http\Controllers\Admin\GuestUsersController;
use App\Http\Controllers\Admin\ReservationController;
use App\Http\Controllers\Admin\ReceptionController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\RoomController;
use App\Http\Controllers\Admin\ProviderController;
use App\Http\Controllers\Admin\BillingController;
use App\Http\Controllers\GoogleController;
use App\Http\Controllers\PaginationPage;


Route::get('/', [PaginationPage::class,'index'])->name('home');


Route::get('/habitaciones', [PaginationPage::class,'room'])->name('Habitaciones');
Route::post('/creando/reserva', [PaginationPage::class, 'storeReservation'])->name('reservas.store');

Route::get('/servicios',[PaginationPage::class,'service'])->name('Servicios');
Route::get('/galeria',[PaginationPage::class,'galery'])->name('Galeria');
Route::get('/contacto', [PaginationPage::class,'contact'])->name('Contacto');
Route::get('/reservationHistories', [PaginationPage::class,'reservationHistories'])->name('Reservaciones');
Route::get('auth/google', [GoogleController::class, 'redirect'])->name('google.login');
Route::get('auth/google/callback', [GoogleController::class, 'callback']);


Route::middleware(['auth', 'verified'])->group(function () {

    // Administrador
    Route::middleware(['role:admin'])->group(function () {

        Route::get('dashboard', [DashboardController::class, 'show'])->name('dashboard');

        // Proveedores
        Route::get('admin/proveedores', [ProviderController::class, 'show'])->name('admin.adminprovider');
        Route::post('admin/proveedores', [ProviderController::class, 'store'])->name('admin.adminprovider.store');
        Route::put('admin/proveedores/{proveedor}', [ProviderController::class, 'update'])->name('admin.adminprovider.update');
        Route::delete('admin/proveedores/{proveedor}', [ProviderController::class, 'destroy'])->name('admin.adminprovider.destroy');

        // Recepcionistas
        Route::get('admin/recepcion', [ReceptionController::class, 'show'])->name('admin.adminreceptionist');
        Route::post('admin/recepcion', [ReceptionController::class, 'store'])->name('admin.adminreceptionist.store');
        Route::put('admin/recepcion/{recepcion}', [ReceptionController::class, 'update'])->name('admin.adminreceptionist.update');
        Route::delete('admin/recepcion/{recepcion}', [ReceptionController::class, 'destroy'])->name('admin.adminreceptionist.destroy');

        Route::put('admin/habitaciones/{room}', [RoomController::class, 'update'])->name('admin.adminrooms.update');
        Route::delete('admin/habitaciones/{room}', [RoomController::class, 'destroy'])->name('admin.adminrooms.destroy');

        // Usuarios
        Route::get('admin/usuarios', [UserController::class, 'show'])->name('admin.adminuser');
        Route::post('admin/usuarios', [UserController::class, 'store'])->name('admin.adminuser.store');
        Route::put('admin/usuarios/{user}', [UserController::class, 'update'])->name('admin.adminuser.update');
        Route::delete('admin/usuarios/{user}', [UserController::class, 'destroy'])->name('admin.adminuser.destroy');

        Route::delete('admin/reservacion/{reservation}', [ReservationController::class, 'destroy'])->name('admin.adminreservation.destroy');
        Route::delete('admin/huespedes/{user}', [GuestUsersController::class, 'destroy'])->name('admin.huespedes.destroy');


    });

    Route::middleware(['role:recepcionista|admin'])->group(function () {
        // Reservaciones
        Route::get('admin/reservacion', [ReservationController::class, 'show'])->name('admin.adminreservation');
        Route::post('admin/reservacion', [ReservationController::class, 'store'])->name('admin.adminreservation.store');
        Route::put('admin/reservacion/{reservation}', [ReservationController::class, 'update'])->name('admin.adminreservation.update');
        // Habitaciones
        Route::get('admin/habitaciones', [RoomController::class, 'show'])->name('admin.adminrooms');
        Route::post('admin/habitaciones', [RoomController::class, 'store'])->name('admin.adminrooms.store');
        // Huéspedes
        Route::get('admin/huespedes', [GuestUsersController::class, 'show'])->name('admin.adminguests');
        Route::post('admin/huespedes', [GuestUsersController::class, 'store'])->name('admin.huespedes.store');
        Route::put('admin/huespedes/{user}', [GuestUsersController::class, 'update'])->name('admin.huespedes.update');

        // Facturación
        Route::get('admin/facturacion',[BillingController::class, 'show'])->name('admin.adminbilling');
        Route::post('admin/facturacion', [BillingController::class, 'store'])->name('admin.adminbilling.store');
        Route::put('admin/facturacion/{invoice}', [BillingController::class, 'update'])->name('admin.adminbilling.update');

    });

    // Password Reset
    Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])
        ->name('password.request');

});


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
