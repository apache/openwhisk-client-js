// Licensed to the Apache Software Foundation (ASF) under one or more contributor
// license agreements; and to You under the Apache License, Version 2.0.

import * as Swagger from 'swagger-schema-official'

export = openwhisk;

declare function openwhisk(options?: openwhisk.Options): openwhisk.Client;

declare namespace openwhisk {
    interface Options {
        api?: string;
        api_key?: string;
        apihost?: string;
        namespace?: string;
        ignore_certs?: boolean;
        apigw_token?: string;
        apigw_space_guid?: string;
    }

    // Client

    interface Client {
        actions: Actions;
        activations: Activations;
        namespaces: Namespaces;
        packages: Packages;
        rules: Rules;
        triggers: Triggers;
        feeds: Feeds;
        routes: Routes;
    }

    // Ressources

    interface Actions {
        list(options?: { namespace?: string; skip?: number; limit?: number; count?: boolean; }): Promise<ActionDesc[]>;
        get(options: string): Promise<Action>
        get(options: { name: string; namespace?: string }): Promise<Action>;
        get(options: (string | { name: string; namespace?: string })[]): Promise<Action[]>;
        invoke(options: string): Promise<{ activationId: string }>
        invoke(options: { name: string; namespace?: string; blocking: boolean; params?: Dict; result: boolean; }): Promise<Dict>;
        invoke(options: { name: string; namespace?: string; blocking: boolean; params?: Dict; result?: boolean; }): Promise<Activation<Dict>>;
        invoke(options: { name: string; namespace?: string; blocking?: boolean; params?: Dict; result?: boolean; }): Promise<{ activationId: string }>;
        invoke(options: (string | { name: string; namespace?: string; blocking?: boolean; params?: Dict; result?: boolean; })[]): Promise<{ activationId: string }[]>;
        invoke<In extends Dict, Out extends Dict>(options: { name: string; namespace?: string; blocking: boolean; params?: In; result: boolean; }): Promise<Out>;
        invoke<In extends Dict, Out extends Dict>(options: { name: string; namespace?: string; blocking: boolean; params?: In; result?: boolean; }): Promise<Activation<Out>>;
        invoke<In extends Dict, Out extends Dict>(options: { name: string; namespace?: string; blocking?: boolean; params?: In; result?: boolean; }): Promise<{ activationId: string }>;
        create(options: { name: string; namespace?: string; action: (string | Buffer | Action); kind?: Kind; overwrite?: boolean; params?: Dict; annotations?: Dict; limits?: Limits; version?: string; }): Promise<Action>;
        //create(options: { name: string; namespace?: string; action: (string | Buffer | Action); kind?: Kind; overwrite?: boolean; params?: Dict; version?: string; }[]): Promise<Action[]>;
        update(options: { name: string; namespace?: string; action: (string | Buffer | Action); kind?: Kind; params?: Dict; annotations?: Dict; limits?: Limits; version?: string; }): Promise<Action>;
        //update(options: ({ name: string; namespace?: string; action: (string | Buffer | Action); kind?: Kind; params?: Dict; version?: string; })[]): Promise<Action[]>;
        delete(options: string): Promise<Action>;
        delete(options: { name: string; namespace?: string; }): Promise<Action>;
        delete(options: (string | { name: string; namespace?: string; })[]): Promise<Action[]>;
    }

    interface Activations {
        list(options?: { namespace?: string; name?: string; skip?: number; limit?: number; upto?: number; docs?: boolean; since?: number; count?: boolean; }): Promise<ActivationDesc[]>;
        get<T extends Dict>(options: string): Promise<Activation<T>>;
        get<T extends Dict>(options: { name: string; namespace?: string }): Promise<Activation<T>>;
        get(options: string): Promise<Activation<Dict>>;
        get(options: { name: string; namespace?: string }): Promise<Activation<Dict>>;
        //get(options: (string | { name: string; namespace?: string })[]): Promise<Activation<Dict>[]>;
        logs(options: { name: string; namespace?: string }): Promise<{ logs: String[] }>;
        result<T extends Dict>(options: { name: string; namespace?: string }): Promise<Response<T>>;
        result(options: { name: string; namespace?: string }): Promise<Response<Dict>>;
    }

    interface Namespaces {
        list(): Promise<string[]>;
        get(options: string): Promise<Namespace>
        get(options: { namespace: string }): Promise<Namespace>
        //get(options: (string | { namespace: string })[]): Promise<Namespace[]>
    }

    interface Packages {
        list(options?: { namespace?: string; skip?: number; limit?: number; public?: boolean; count?: boolean; }): Promise<PackageDesc[]>;
        get(options: string): Promise<Package>
        get(options: { name: string; namespace?: string }): Promise<Package>;
        get(options: (string | { name: string; namespace?: string })[]): Promise<Package[]>;
        create(options: { name: string; namespace?: string; package?: Package; overwrite?: boolean }): Promise<Package>;
        update(options: { name: string; namespace?: string; package?: Package }): Promise<Package>;
        delete(options: string): Promise<Package>
        delete(options: { name: string; namespace?: string; }): Promise<Package>;
        delete(options: (string | { name: string; namespace?: string; })[]): Promise<Package[]>;
    }

    interface Rules {
        list(options?: { namespace?: string; skip?: number; limit?: number; count?: boolean; }): Promise<RuleDesc[]>;
        get(options: string): Promise<Rule>;
        get(options: { name: string; namespace?: string; }): Promise<Rule>;
        get(options: (string | { name: string; namespace?: string; })[]): Promise<Rule[]>;
        create(options: { name: string; namespace?: string; action: string; trigger: string; status?: Status; overwrite?: boolean }): Promise<Rule>;
        update(options: { name: string; namespace?: string; action: string; trigger: string; status?: Status }): Promise<Rule>;
        delete(options: string): Promise<Rule>
        delete(options: { name: string; namespace?: string; }): Promise<Rule>;
        delete(options: (string | { name: string; namespace?: string; })[]): Promise<Rule[]>;
        enable(options: { name: string; namespace?: string; }): Promise<String>;
        disable(options: { name: string; namespace?: string; }): Promise<String>;
    }

    interface Triggers {
        list(options?: { namespace?: string; skip?: number; limit?: number; count?: boolean; }): Promise<TriggerDesc[]>;
        get(options: string): Promise<Trigger>
        get(options: { name: string; namespace?: string; }): Promise<Trigger>;
        get(options: (string | { name: string; namespace?: string; })[]): Promise<Trigger[]>;
        invoke(options: string): Promise<{ activationId: string }>
        invoke(options: { name: string; namespace?: string; params?: Dict }): Promise<{ activationId: string }>
        invoke(options: (string | { name: string; namespace?: string; params?: Dict })[]): Promise<{ activationId: string }[]>
        invoke<T extends Dict>(options: { name: string; namespace?: string; params?: T }): Promise<{ activationId: string }>
        create(options: { name: string; namespace?: string; trigger?: Trigger; overwrite?: boolean; }): Promise<Trigger>;
        update(options: { name: string; namespace?: string; trigger?: Trigger }): Promise<Trigger>;
        delete(options: string): Promise<Trigger>
        delete(options: { name: string; namespace?: string; }): Promise<Trigger>;
        delete(options: (string | { name: string; namespace?: string; })[]): Promise<Trigger[]>;
    }

    interface Feeds {
        create(options: { name: string; trigger: string; namespace?: string; params?: Dict }): Promise<Activation<FeedActionDesc>>;
        delete(options: { name: string; trigger: string; namespace?: string; }): Promise<Activation<FeedActionDesc>>;
        feed(event: Event, options: { name: string; trigger: string; namespace?: string; }): Promise<Activation<FeedActionDesc>>;
    }

    interface Routes {
        list(options?: { relpath?: string, basepath?: string, operation?: string, limit?: number, skip?: number }): Promise<{ apis: Route[] }>;
        delete(options: { basepath: string; relpath?: string, operation?: Operation }): Promise<{}>;
        create(options: { basepath?: string; relpath: string, operation: Operation, action: string }): Promise<Api>;
    }

    // Descriptions

    interface ShortDesc {
        name?: string;
        annotations?: KeyVal[];
        version?: string;
    }

    interface Desc extends ShortDesc {
        publish?: boolean;
        namespace?: string;
    }

    type ActionDesc = Desc

    interface ActivationDesc extends Desc {
        activationId: string;
    }

    interface PackageDesc extends Desc {
        binding?: boolean;
    }

    type RuleDesc = Desc

    type TriggerDesc = Desc

    interface FeedActionDesc {
        lifecycleEvent: Event;
        authKey: string;
        triggerName: string;
    }

    // Entities

    interface Action extends ActionDesc {
        parameters?: KeyVal[];
        limits?: Limits;
        exec: Exec | Sequence;
    }

    interface Activation<T extends Dict> extends ActivationDesc {
        subject: string;
        start: number;
        end: number;
        duration: number;
        response?: Response<T>;
        logs: string[];
    }

    interface Namespace {
        actions?: ActionDesc[];
        packages?: PackageDesc[];
        rules?: RuleDesc[];
        triggers?: TriggerDesc[];
    }

    interface Package extends Desc {
        actions?: ShortDesc[];
        feeds?: ShortDesc[];
        parameters?: KeyVal[];
        binding?: {} | Package;
    }

    interface Rule extends RuleDesc {
        trigger: PathName;
        status: Status;
        action: PathName;
    }

    interface Trigger extends TriggerDesc {
        parameters?: KeyVal[];
        limits?: any;
    }

    interface Route {
        id: string;
        key: string;
        value: Api;
    }

    // Other

    interface Dict {
        [key: string]: any
    }

    interface Exec {
        kind: Kind;
        code: string;
        binary?: boolean
    }

    interface Sequence {
        kind: "sequence";
        components: string[];
    }

    type Kind =
        "" |
        "java" |
        "nodejs:default" |
        "nodejs:6" |
        "nodejs:8" |
        "python:default" |
        "python:3" |
        "python:2" |
        "swift:default" |
        "swift:3.1.1" |
        "swift:4.1" |
        "php:default" |
        "php:7.1";

    interface Limits {
        timeout?: number;
        memory?: number;
        logs?: number;
    }

    interface Response<T extends Dict> {
        status: "success" | "failure";
        statusCode?: number;
        success: boolean;
        result: T
    }

    interface KeyVal {
        key: string;
        value: any;
    }

    interface PathName {
        path: string;
        name: string;
    }

    type Status =
        "" |
        "active" |
        "inactive" |
        "activating" |
        "deactivating";

    type Event =
        "" |
        "CREATE" |
        "DELETE" |
        "PAUSE" |
        "UNPAUSE"

    type Operation =
        "" |
        "GET" |
        "POST" |
        "PUT" |
        "PATCH" |
        "DELETE"

    interface Api {
        namespace: string;
        gwApiActivated: boolean;
        tenantId: boolean;
        gwApiUrl: string;
        apidoc: Swagger.Spec;
    }

}
