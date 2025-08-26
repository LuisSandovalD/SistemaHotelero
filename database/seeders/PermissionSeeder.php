<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PaymentMethod;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            "users.view",
            "users.edit",
            "users.delete",
            "users.create",
            "role.view",
            "role.edit",
            "role.delete",
            "role.create",
        ];
        foreach ($permissions as $key => $value) {
            Permission::create(["name"=>$value]);
        }
    }
}
